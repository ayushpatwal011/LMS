import { AppError } from "../middlewares/appError.js"
import { courseModel } from "../models/course.model.js"
import { asyncHandler } from "../utilittes/asyncHandler.js"
import fs from "fs/promises"
import cloudinary from "cloudinary"

export const getAllCourses = asyncHandler( async(req,res,next)=>{
    const courses = await courseSchema.find({}).select("-lecture")
    if(!courses){
        next(new AppError("No Course found Now", 400))
    }

    res.status(200).json({
        success:true,
        message:"All Course",
        courses
    })
})

export const getLectureByCourseId = asyncHandler( async (req,res,next)=>{
    const {id} =req.params

    const course = await courseModel.findById(id)
    if(!course){
        next(new AppError("Invalid Course ID", 400))
    }

    res.status(200).json({
        success:true,
        message:"Course leacture fetched Successfully",
        lectures:course.leacture
    })

})

export const createCourse = asyncHandler( async (req,res,next)=>{
    const { title , description , catagory , createdby } = req.body
    // if(!title || !description || !catagory || !createdby ){
    //     next(new AppError("All feilds are require",400))
    // }
    // const course = await courseModel.create({
    //     title,
    //     description,
    //     catagory,
    //     createdby,
    //     thumbnial:{
    //     public_id:"temp",
    //     secure_url:"temp"
    // }})
    // if(!course){
    //     next(new AppError("Course is not created, Try again",400))
    // }
    // if(req.file){
    //     const result = await cloudinary.v2.upload(req.file.path, {
    //         folder : "LMS"
    //     })
    // }
    // if(result){
    //     course.thumbnial.public_id = result.public_id
    //     course.thumbnial.secure_url = result.secure_url
    // }
    // console.log(JSON.stringify(result))

    // fs.rm(`uploads/${req.file.filename}`)

    // course.save()

    res.status(200).json({
        success:true,
        message:"Course created Successfully",
        lectures:course.leacture
    })
})

export const updateCoure = asyncHandler( async (req,res,next)=>{


    res.status(200).json({
        success:true,
        message:"Course update Successfully",
        lectures:course.leacture
    })

})
export const removeCourse = asyncHandler( async (req,res,next)=>{


    res.status(200).json({
        success:true,
        message:"Course remove Successfully",
        lectures:course.leacture
    })

})
