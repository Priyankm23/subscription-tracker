import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";


export const authorize=async(req,res,next)=>{
    try {

        // let token;
        // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //     token=req.headers.authorization.split(' ')[1];
        // }

        const token=req.cookies.token;
        
        if(!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        const decoded=jwt.verify(token,JWT_SECRET);

        const user= await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token. User not found." 
            });
        }

        req.user=user;
        next();

    } catch (error) {
        res.status(401).redirect("/login.html");
    }

};

export const restrictTo=(roles=[])=>{
    return function(req,res,next){
        if(!req.user) return res.status(401).json({error: "please login to handle the subscriptions"})

        if(!roles.includes(req.user.role)) return res.status(403).json({error: "not allowed to handle the subscriptions"})

        return next();
    }
}


