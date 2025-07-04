import User from "../models/userModel.js";


export const getUsers=async(req,res,next)=>{
    try {
        const Users=await User.find({})

        res.status(200).json({sucess:true,data:Users})

    } catch (error) {
        next(error)
    }
};

export const getUserbyID=async(req,res,next)=>{
    try {
        const user = await User.findOne({ _id: req.params.userId });

        if(!user){
            const error = new Error("User not found")
            error.statusCode=404
            throw error
        }

        res.status(200).json({sucess:true,data:user})

    } catch (error) {
        next(error)
    }
};

export const updateUserbyId = async(req,res,next)=>{
    try {
        const user= await User.findByIdAndUpdate(req.params.id,
            ...req.body
        )
        
        if(!user){
            const error = new Error("User not found")
            error.statusCode=404
            throw error
        }

        res.status(200).json({success:true,data:user})
    } catch (error) {
        next(error)
    }
}