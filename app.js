import express from "express"
export const app =  express()
import userRouter from "./routers/user.router.js"
import cookieParser from "cookie-parser"
import {dbconnection} from "./configs/dbconnection.js"
import morgan from "morgan"
import cors from "cors"
import {errorMiddleware} from "./middlewares/errorMiddleware.js"
import  courseRoute from "./routers/course.router.js"

app.use(cors({
    origin:[process.env.FRONTEND_URI],
    credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

dbconnection();
app.use('/api/v1/user', userRouter)

app.use('/api/v1/course', courseRoute)

app.all("*",(req,res) =>{
    res.status(404),send("OOPs Page is not Found")
})
app.use(errorMiddleware)