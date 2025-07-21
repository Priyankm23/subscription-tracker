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

subscriptionRouter.get('/all',getAllsubscriptions);

subscriptionRouter.get('/upcoming',restrictTo(["admin"]),getUpcomingRenewals);

subscriptionRouter.get('/user',authorize,getUserSubscription);

subscriptionRouter.get('/:id',restrictTo(["user"]),getSubscriptionById);

subscriptionRouter.post('/',authorize,createSubscription);

subscriptionRouter.put('/edit/:name',authorize,updateSubscription);

subscriptionRouter.delete('/delete',authorize,deleteSubscription);

subscriptionRouter.put('/:id/cancel',restrictTo(["user"]),cancelSubscription);

export default subscriptionRouter
