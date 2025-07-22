import {Router} from "express"
import {authorize, restrictTo} from "../middlewares/authMiddleware.js"
import { getUsers, updateUserbyId ,getAdminDashboardData} from "../controllers/admin.js";

const adminRouter=Router();

adminRouter.get('/',getUsers);

adminRouter.put('/:id',authorize,updateUserbyId);

adminRouter.get("/dashboard",authorize,restrictTo(["admin"]),getAdminDashboardData);

export default adminRouter;

