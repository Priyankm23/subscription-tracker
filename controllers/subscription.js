import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscriptionModel.js"
import {SERVER_URL} from "../config/env.js"
import dayjs from "dayjs";
import workflowRouter from "../routes/workflow-routes.js";

export const getUserSubscription=async(req,res,next)=>{
    try {
        if(req.user._id.toString()!==req.params.id){
            const error = new Error('you are not the owner of this account')
            res.statusCode=401
            throw error
        };

        const subscription= await Subscription.find({user : req.params.id});

        res.status(200).json({success: true, data: subscription});
    } catch (error) {
        next(error)
    };
};

export const getAllsubscriptions=async(req,res,next)=>{
    try {
        const subscriptions=await Subscription.find({});

        res.status(200).json({success: true,data : subscriptions});
    } catch (error) {
        next(error)
        
    }
};

export const getSubscriptionById=async(req,res,next)=>{
    try {
        if(!req.params.id){
            const error = new Error('subscription ID is not provided')
            res.statusCode=401
            throw error
        }

        const subscription=await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error('subscription not found')
            res.statusCode=404
            throw error
        }
 
        res.status(200).json({success:true, data: subscription});

    } catch (error) {
        next(error)
    }
};

export const updateSubscription=async(req,res,next)=>{
    try {
        if(!req.params.id){
            const error = new Error('subscription ID is not provided')
            res.statusCode=401
            throw error
        }

        const subscription=await Subscription.findByIdAndUpdate(
        req.params.id,
        {...req.body},
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


    res.status(201).json({success : true, data: subscription,workflowRunId});
        
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription=async(req,res,next)=>{
    try {
        if(!req.params.id){
            const error = new Error('subscription ID is not provided')
            res.statusCode=401
            throw error
        }

        const subscription=await Subscription.findByIdAndDelete(req.params.id);

        if(!subscription){
            return res.status(404).json({delete: false,message:"subscription not found to delete"});
        }

        res.status(200).json({delete:true, message: `${subscription.name}-${subscription.id} id deleted `});
    } catch (error) {
        next(error);
    }
    
};

export const cancelSubscription=async(req,res,next)=>{
    try {
        if(!req.params.id){
            const error = new Error('subscription ID is not provided')
            res.statusCode=401
            throw error
        }
  
        const subscription=await Subscription.findByIdAndUpdate(
            req.params.id,
            {...req.body},
             {
                new: true,           
                runValidators: true  
             }
        );

        if(!subscription){
            return res.status(404).json({cancel: false,message:"subscription not found to cancel"});
        }

        res.status(200).json({update: true, message: `${subscription.id} - status updated. current status: ${subscription.status}`});
        
    } catch (error) {
        next(error);
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