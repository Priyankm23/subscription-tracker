import {createRequire} from "module";
const require= createRequire(import.meta.url);
const { serve } =require("@upstash/workflow/express");
import Subscription from "../models/subscriptionModel.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-emails.js";
import { subscribe } from "diagnostics_channel";

const REMINDERS=[7,5,2,1];

export const sendReminders=serve(async(context)=>{
    const subscriptionId = context.requestPayload.subscriptionId;
    const subscription= await fetchSubscription(context,subscriptionId);

    if(!subscription || subscription.status !== "active") return; 
    
    const renewalDate= dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for subscription ${subscriptionId}. stopping workflow`);
        return;
    }

    for (const daysBefore of REMINDERS){
        const reminderDate= renewalDate.subtract(daysBefore,'day');
        
        if(reminderDate.isAfter(dayjs())){
          await sleepUntilReminder(context,`${daysBefore} days before reminder`,reminderDate);
        }

        await triggerReminder(context,`${daysBefore} days before reminder`,subscription)
    }
}); 


const fetchSubscription=async (context,subscriptionId)=>{
    return await context.run('get subscription',async()=>{
      const sub=await Subscription.findById(subscriptionId).populate("user", "name email");

      return sub?.toObject?.() ?? sub ?? null;
    });
};

const sleepUntilReminder = async(context,label,date)=>{
    console.log(`sleeping until ${label} at ${date}`);
    await context.sleepUntil(label,date.toDate());
};

const triggerReminder = async(context,label,subscription)=>{
    return await context.run(label,async ()=>{
        console.log(`triggering ${label}`);

        await sendReminderEmail(
            subscription.user.email,
            label,
            subscription
        );
    })
};