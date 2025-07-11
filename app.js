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
import morgan from "morgan"
import path from "path"

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(arcjetMiddleware)

app.get('/dashboard.html', (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect('/');
  }
  next();
});

app.use(express.static("public"));

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',authorize,restrictTo(["ADMIN"]),userRouter);
app.use('/api/v1/subscriptions',subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorMiddleware);

app.get('/auth/google/callback',
    passport.authenticate("google",{session: false, failureRedirect: "/" }),
    (req,res)=>{
        res.cookie("token",req.user.jwt,{httpOnly: true, secure: false,path: "/"});
        res.redirect("/dashboard.html");
    }
);

app.listen(PORT,async()=>{
    console.log("Subscription Tracker API is runnig on http://localhost:5000")

    await connectToDatabase()
});

