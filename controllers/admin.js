import User from "../models/userModel.js";
import Subscription from "../models/subscriptionModel.js";

export const getUsers=async(req,res,next)=>{
    try {
        const Users=await User.find({})

        res.status(200).json({sucess:true,data:Users})

    } catch (error) {
        next(error)
    }
};


export const updateUserbyId = async(req,res,next)=>{
    try {
        const user= await User.findByIdAndUpdate(req.params.id,
            ...req.body
        )
        
        if(!user){
            const error = new Error("User not found")
            error.statusCode=404
            throw error
        }

        res.status(200).json({success:true,data:user})
    } catch (error) {
        next(error)
    }
};

export const getAdminDashboardData = async (req, res, next) => {
    try {
        // 1. Total Number of Subscriptions (All)
        const totalSubscriptions = await Subscription.countDocuments();

        // 2. Total Users
        const totalUsers = await User.countDocuments();

        // 3. Subscriptions in Each Category
        const subscriptionsByCategory = await Subscription.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { category: 1 } // Sort by category name
            }
        ]);

        // 4. Soonest Upcoming Renewal for Each User (closest in the future)
        const latestUpcomingRenewalPerUser = await Subscription.aggregate([
            {
                $match: {
                    status: 'active', // Only active subscriptions
                    renewalDate: { $gte: new Date() } // Renewal date is in the future
                }
            },
            {
                $sort: { user: 1, renewalDate: 1 } // Sort by user, then by soonest (ascending) renewal date
            },
            {
                $group: {
                    _id: '$user', // Group by user ID
                    latestUpcomingRenewal: { $first: '$$ROOT' } // Get the first document (which is the soonest due to 1 sort) for each user group
                }
            },
            {
                $lookup: {
                    from: 'users', // The name of the users collection in MongoDB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Deconstruct the userDetails array
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    subscriptionName: '$latestUpcomingRenewal.name',
                    renewalDate: '$latestUpcomingRenewal.renewalDate',
                    price: '$latestUpcomingRenewal.price',
                    currency: '$latestUpcomingRenewal.currency',
                    category: '$latestUpcomingRenewal.category'
                }
            },
            {
                $sort: { userName: 1 } // Sort the final list by user name
            }
        ]);

        // 5. Maximum Subscription of Each User
        const maxSubscriptionPerUser = await Subscription.aggregate([
            {
                $match: { status: 'active' } // Consider only active subscriptions for max
            },
            {
                $sort: { user: 1, price: -1 } // Sort by user, then by price descending
            },
            {
                $group: {
                    _id: '$user', // Group by user ID
                    maxSubscription: { $first: '$$ROOT' } // Get the first (highest price) subscription for each user
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    subscriptionName: '$maxSubscription.name',
                    price: '$maxSubscription.price',
                    currency: '$maxSubscription.currency'
                }
            },
            {
                $sort: { userName: 1 } // Sort the final list by user name
            }
        ]);

        // 6. Total Active and Cancelled Subscriptions
        const totalActiveSubscriptions = await Subscription.countDocuments({ status: 'active' });
        const totalCancelledSubscriptions = await Subscription.countDocuments({ status: 'cancelled' });

        res.status(200).json({
            status: 'success',
            data: {
                totalSubscriptions,
                totalUsers,
                subscriptionsByCategory,
                latestUpcomingRenewalPerUser, // Variable name remains consistent
                maxSubscriptionPerUser,
                totalActiveSubscriptions,
                totalCancelledSubscriptions
            }
        });

    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        next(error);
    }
};