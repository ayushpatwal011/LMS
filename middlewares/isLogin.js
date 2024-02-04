import jwt from "jsonwebtoken"
import { AppError } from "./appError.js"

export const islogin = async(req,res,next)=>{

    const token = req.cookies.token
    if(!token){return next(new AppError("Something went wrong res.cookie.token not exist"))}

    const userdetails = await jwt.verify(token, process.env.JWT_SECRAT)
    req.user = userdetails

    next()
}