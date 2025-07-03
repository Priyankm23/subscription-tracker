import mongoose  from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import Subscription from "../models/subscriptionModel.js"

import User from "../models/userModel.js"
import { JWT_EXPIRES_IN, JWT_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET } from "../config/env.js"

export const signUp= async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
   
    try {
        const {name,email,password,role}=req.body;
        
        //check if user with a email already exists - we want unique emails
        const existingUser=await User.findOne({email})

        if(existingUser){
            const error=new Error('User already exists')
            error.statusCode=409
            throw error
        }
        
        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser= await User.create([{name,email,password:hashedPassword,role}],{session});

        const token = jwt.sign({userId : newUser[0]._id,role: newUser[0].role},JWT_SECRET,{expiresIn : JWT_EXPIRES_IN})

        await session.commitTransaction();
        session.endSession();

        res.cookie("token",token,{httpOnly: true, secure: false});
        res.redirect("/login.html")

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }

};

export const signIn= async (req,res,next)=>{
    try {
        const {email,password} = req.body;

        const user=await User.findOne({email});

        if(!user){
            const error = new Error("User not found")
            error.statusCode=404
            throw error
        }
        
        const isPasswordValid=await bcrypt.compare(password,user.password)
        
        if(!isPasswordValid){
            const error=new Error("Invalid password")
            error.statusCode=401
            throw error
        }
        // const subscriptions = await Subscription.find({user: user._id});

        const token = jwt.sign({userId : user._id,role: user.role},JWT_SECRET,{expiresIn : JWT_EXPIRES_IN})

        res.cookie("token",token,{httpOnly: true, secure: false});
        res.redirect("/index.html");
    } catch (error) {
        next(error);
    }
};

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },async (accessToken, refreshToken, profile, done) => {
    const session=await mongoose.startSession();
    session.startTransaction();
    try {
        const existingUser= await User.findOne({email: profile.emails[0].value});

        if(existingUser){
            const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            profile.jwt = token;
            done(null, profile);
            return;
        }
        const name=profile.displayName;
        const email=profile.emails[0].value;
        const password=profile.id;

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser= await User.create([{name,email,password:hashedPassword,role}],{session});

        const token = jwt.sign({userId : newUser[0]._id},JWT_SECRET,{expiresIn : JWT_EXPIRES_IN});
        profile.jwt=token;

        await session.commitTransaction();
        session.endSession();

        return done(null,profile);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return done(error,null)
    }
  }
));

export default passport;