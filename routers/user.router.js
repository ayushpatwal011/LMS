import express from "express"
export const Router = express.Router()
import { register , login, logout, myprofile, resetPassword, foregtPassword } from "../controllers/user.controller.js"
import {islogin} from "../middlewares/isLogin.js"
import { upload } from "../middlewares/multer.js"


Router.route("/register")
    .post( upload.single("avatar") , register)

Router.route("/login")
    .post(login)

Router.route("/logout")
    .get(logout)

Router.route("/myprofile")
    .get( islogin ,  myprofile)

Router.route("/forget-password")
    .get(  foregtPassword)

Router.route("/reset-password")
    .get( resetPassword)



