import {Router} from "express";
import { sendReminders } from "../controllers/workflow.js";
import { sendSubscriptionReminder } from "../controllers/workflow.js";

const workflowRouter=Router();

workflowRouter.post("/subscription/reminder",sendReminders);


workflowRouter.post('/send-reminder', async (req, res) => {
  const { phone, userName, subscriptionName, renewalDate } = req.body;

  try {
    await sendSubscriptionReminder(phone, userName, subscriptionName, renewalDate);
    res.status(200).json({ success: true, message: 'Reminder sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send reminder' });
  }
});

export default workflowRouter;