import {Router} from "express"
import {authorize} from "../middlewares/authMiddleware.js"
import { getUserbyID, getUsers, updateUserbyId } from "../controllers/user.js";

const userRouter=Router();

userRouter.get('/',getUsers);

userRouter.get('/:id',authorize,getUserbyID);

userRouter.post('/',(req,res)=>{
    res.send({title : 'CREATE new user'})
});
userRouter.put('/:id',authorize,updateUserbyId)

userRouter.delete('/:id',(req,res)=>{
    res.send({title : 'DELETE the user'})
});

export default userRouter

