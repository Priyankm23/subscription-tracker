import {Router} from "express";
import passport from "../controllers/auth.js";
import {
    signIn,
    signUp
} from "../controllers/auth.js"

const authRouter=Router();

// api/v1/auth/sign-up
authRouter.post('/signup',signUp);

authRouter.post('/signin',signIn);

authRouter.get('/google/login',
    passport.authenticate("google",{scope:["profile","email"]})
);

authRouter.get("/",(req,res)=>{
     res.send("<a href=/api/v1/auth/google/login>login with google</a>")
});

export default authRouter;

