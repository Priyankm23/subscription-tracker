import express, { urlencoded } from "express"
import {PORT} from "./config/env.js"
import authRouter from "./routes/auth-routes.js"
import userRouter from "./routes/user-routes.js"
import subscriptionRouter from "./routes/subscription-routes.js"
import connectToDatabase from './database/dbconnection.js'
import errorMiddleware from "./middlewares/errorMiddleware.js"
import cookieParser from "cookie-parser"
import arcjetMiddleware from "./middlewares/arcjetMiddleware.js"
import workflowRouter from "./routes/workflow-routes.js"
import passport from "./controllers/auth.js";
import { authorize ,restrictTo } from "./middlewares/authMiddleware.js"

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(arcjetMiddleware)

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',authorize,restrictTo(["ADMIN"]),userRouter);
app.use('/api/v1/subscriptions',authorize,subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);

app.use(errorMiddleware);

app.get('/auth/google/callback',
    passport.authenticate("google",{session: false, failureRedirect: "/" }),
    (req,res)=>{
        res.cookie("jwt",req.user.jwt,{httpOnly: true, secure: false});
        res.status(200).json({success: true, token: req.user.jwt});
    }
);

app.listen(PORT,async()=>{
    console.log("Subscription Tracker API is runnig on http://localhost:5000")

    await connectToDatabase()
});

