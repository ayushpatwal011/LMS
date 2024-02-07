import {userModel} from "../models/user.model.js";
import {AppError} from "../middlewares/appError.js";
import {asyncHandler} from "../utilittes/asyncHandler.js"
import { sendToken } from "../utilittes/sendToken.js";
import fs from "fs/promises"
import cloudinary from "cloudinary"
import { sendEmail } from "../utilittes/sendEmail.js";
import { log } from "console";
import crypto from "crypto"

export const register = asyncHandler(async (req,res,next)=>{

     const {fullname,email,password} = req.body
    
        if(!fullname,!email,!password){
            return next( new AppError("Submit all the Feilds",400))
        }
    
        const userExists = await userModel.findOne({email})
    
        if(userExists){
            return  next( new AppError("User allready Exist",409))
        } 

         const user = await userModel.create({
            fullname,
            email,
            password,
            avatar: {
                public_id: "temprary",
                secure_url: "temprary",
            },
        })
    
        if(!user){
            return  next( new AppError("User register faild, Try again later",400))
        } 

       // uploade file on cloudnry   
       
    if (req.file) {
       
        try { 
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "LMS",
                width:250,
                height:250,
                gravity:"faces",
                crop:"fill"
            })
    if(result){
        user.avatar.public_id = result.public_id
        user.avatar.secure_url = result.secure_url
    }
    // Remove file from server
    fs.rm(`uploads/${req.file.filename}`)
} catch (e) {return next(new AppError("File not uploaded || Please try again"))}
}

    await user.save();
        user.password = undefined;
        sendToken(res , user , "Registration Successfully" ,201)
}
)

export const login = asyncHandler(async (req,res,next)=>{

     const {email,password} = req.body 
        if(!email,!password){
            return next( new AppError("Submit all the Feilds",400))
        }
    
        const user = await userModel.findOne({email}).select("+password")
        if(!user){
            return  next( new AppError("User do not exist",409))
        }

        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return  next( new AppError("Incorrect Email or Password",409))
        }

        sendToken(res , user , `User login Sucessfully ${user.fullname} `,200)
}
)

export const logout = asyncHandler(async (req,res,next)=>{

    res.status(200)
    .cookie("token" , null , {expires : new Date(Date.now())})
    .json({
        success:true,
        message:"Logout Successfully"
    })
}
)

export const myprofile = asyncHandler(async (req,res,next)=>{
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        success:true,
        message:"user details",
        user
    })
})

export const forgetPassword = asyncHandler(async (req,res,next)=>{
    const {email} = req.body
    if(!email){return next(new AppError("Email is required",400))}

    const user = await userModel.findOne({email})
    if(!user){return next(new AppError("Email not registered",400))}

    const resetToken = await user.generatePasswordResetToken()

    await user.save()

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}` //link

    const subject = "Reset Password Link "
    const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank"> Reset your Password</a>\n
    If the above link does not work for some reasons then copy the link and open in new tab ${resetPasswordURL}`

    // send mail
        try {
            await sendEmail(email , subject , message)
            res.status(200).json({
                success:true,
                message : `Reset password link has been send to ${email} successfully`
            })
        } catch (e) {
            user.forgetPasswordExpiry = undefined
            user.forgetPasswordToken = undefined

            await user.save()
            return next(new AppError(e.message , 500))
        }
    })

export const resetPassword = asyncHandler(async (req,res,next)=>{
    const {resetToken} = req.params;
    const {password} = req.body
    if(!password){ return next(new AppError("Enter your new password" , 400))}

    const forgetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    const user = await userModel.findOne(
    { forgetPasswordToken,
    forgetPasswordExpiry:{$gt : Date.now()} })
    
    if(!user){
    return next(new AppError("Link is invalid of expired, please try again" , 400))}

    user.password =  password;
    user.forgetPasswordExpiry = undefined
    user.forgetPasswordToken = undefined

    user.save();

    res.status(200).json({
    success:true,
    message:"Pasword change Successfully"})
    })
