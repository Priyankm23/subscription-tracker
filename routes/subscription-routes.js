import {Router} from "express"
import { cancelSubscription, 
 createSubscription,
 deleteSubscription,
 getAllsubscriptions,
 getSubscriptionById,
 getUpcomingRenewals,
 getUserSubscription, 
 updateSubscription } 
from "../controllers/subscription.js";
import { restrictTo ,authorize} from "../middlewares/authMiddleware.js";

const subscriptionRouter=Router();

subscriptionRouter.get('/',getAllsubscriptions);

subscriptionRouter.get('/:id',restrictTo(["NORMAL"]),getSubscriptionById);

subscriptionRouter.post('/',authorize,createSubscription);

subscriptionRouter.put('/edit/:name',authorize,updateSubscription);

subscriptionRouter.delete('/delete',authorize,deleteSubscription);

subscriptionRouter.get('/user/me',authorize,getUserSubscription);

subscriptionRouter.put('/:id/cancel',restrictTo(["NORMAL"]),cancelSubscription);

subscriptionRouter.get('/upcoming/renewals',restrictTo(["ADMIN"]),getUpcomingRenewals);


export default subscriptionRouter
