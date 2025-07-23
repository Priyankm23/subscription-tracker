import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscriptionModel.js"
import User from "../models/userModel.js";
import {SERVER_URL} from "../config/env.js"
import dayjs from "dayjs";
import workflowRouter from "../routes/workflow-routes.js";

export const getUserSubscription=async(req,res,next)=>{
    try {
        if(!req.user._id){
            const error = new Error("User not authorized to view subscriptions")
            res.statusCode=401
            throw error
        }

        const subscriptions = await Subscription.find({user: req.user._id});

        if(!subscriptions){
            const error = new Error('subscription not found')
            res.statusCode=404
            throw error
        }
 
        res.status(200).json({ success: true, data: subscriptions });
        // res.status(200).json({success: true, data: subscription});
    } catch (error) {
        next(error)
    };
};

export const getAllsubscriptions=async(req,res,next)=>{
    try {
        const subscriptions=await Subscription.find({});

        res.status(200).send(subscriptions);
    } catch (error) {
        next(error)
        
    }
};

export const getSubscriptionById=async(req,res,next)=>{
    try {
        if(!req.params.name){
            const error = new Error('name of the user is not provided')
            res.statusCode=401
            throw error
        }

        const user=await User.findOne({name : req.params.name});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const subscription=await Subscription.findById(user._id);

        if(!subscription){
            const error = new Error('subscription not found')
            res.statusCode=404
            throw error
        }
 
        res.status(200).send(subscription);

    } catch (error) {
        next(error)
    }
};

export const updateSubscription=async(req,res,next)=>{
    try {
        if(!req.user._id || !req.params.name){
            const error = new Error('user not authorized to edit')
            res.statusCode=401
            throw error
        }

        const subscription=await Subscription.findOneAndUpdate(
            {user: req.user._id, name: req.params.name},
            {...req.body}
        );

        if (!subscription) {
          return res.status(404).json({ update: false, message: "Subscription not found" });
        }

        res.status(200).json({update: true,data: subscription});
    } catch (error) {
        next(error)
    }
};

export const createSubscription=async(req,res,next)=>{
    try {
        const subscription=await Subscription.create({
        ...req.body,
        user:req.user._id
    });

    const {workflowRunId}=await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body:{
            subscriptionId: subscription.id
        },
        headers:{
            'content-type': 'application/json'
        },
        retries: 0,
    });

    res.status(201).json({success : true, data: subscription});
        
    } catch (error) {
        next(error);
    }
};


export const deleteSubscription = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) { // Ensure req.user and _id are present for authorization
            const error = new Error("User is not authorized.");
            res.statusCode = 401;
            throw error;
        }

        const { name } = req.params; // Get the subscription name from URL parameters

        const subscription = await Subscription.findOneAndDelete({
            name: name,
            user: req.user._id // Crucial for multi-tenancy: ensuring only the user's own subscription is deleted
        });

        if (!subscription) {
            return res.status(404).json({ delete: false, message: "Subscription not found or you don't have permission to delete it." });
        }

        res.status(200).json({ delete: true, message: `${subscription.name} subscription deleted successfully.` });
    } catch (error) {
        console.error("Error deleting subscription:", error); // Log the error for debugging
        next(error); // Pass error to the next middleware (error handler)
    }
};

export const cancelSubscription = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) { // Ensure user is authenticated
            const error = new Error("User is not authorized.");
            res.statusCode = 401;
            throw error;
        }

        const { name } = req.params; // Get the subscription name from URL parameters

        const subscription = await Subscription.findOneAndUpdate(
            { name: name, user: req.user._id }, 
            { status: 'cancelled' },             
            {
                new: true,           // Return the modified document rather than the original
                runValidators: true  // Run model validators on the update
            }
        );

        if (!subscription) {
            return res.status(404).json({ cancel: false, message: "Subscription not found or you don't have permission to cancel it." });
        }

        res.status(200).json({ update: true, message: `Subscription '${subscription.name}' status updated to 'cancelled'.` });

    } catch (error) {
        console.error("Error canceling subscription:", error); // Log the error for debugging
        next(error); // Pass error to the next middleware (error handler)
    }
};

export const getUpcomingRenewals=async(req,res,next)=>{
    try {
        const today=dayjs();
        const nextWeek=today.add(7,'day');

        const subscriptions=await Subscription.find({
            status: 'active',
            renewalDate:{
                $gte: today.toDate(),
                $lte: nextWeek.toDate()
            }
        }).populate("user","name email");

        if(!subscriptions){
            return res.status(404).json({success: false,message:"no upcoming subscriptions found "});
        };

        res.status(200).json({
        success: true,
        count: subscriptions.length,
        data: subscriptions
    });
    } catch (error) {
        next(error);
    }
}

export const renewSubscription = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            const error = new Error("User is not authorized.");
            res.statusCode = 401;
            throw error;
        }

        const { name } = req.params; // Get the subscription name from URL parameters

        // Find the subscription by its name and user ID, then update its status to 'active'
        const subscription = await Subscription.findOneAndUpdate(
            { name: name, user: req.user._id }, // Filter by name and user ID
            { status: 'active' },             // Set status to 'active'
            {
                new: true,           // Return the modified document rather than the original
                runValidators: true  // Run model validators on the update
            }
        );

        if (!subscription) {
            return res.status(404).json({ renew: false, message: "Subscription not found or you don't have permission to renew it." });
        }

        res.status(200).json({ update: true, message: `Subscription '${subscription.name}' status updated to 'active' (renewed).` });

    } catch (error) {
        console.error("Error renewing subscription:", error);
        next(error);
    }
};