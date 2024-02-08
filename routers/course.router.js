import express from "express"
import { createCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCoure } from "../controllers/course.controller.js"
import { islogin } from "../middlewares/isLogin.js"
import { upload } from "../middlewares/multer.js"

const Router = express.Router()

Router.route("/")
.get( getAllCourses)
.post( upload.single("thumbnial"), 
    createCourse )

Router.route("/:id")
.get( islogin , getLectureByCourseId)
.put( updateCoure )
.delete( removeCourse )

export default Router