import mongoose from "mongoose";
import { asyncHandler } from "../utilittes/asyncHandler.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/user"

mongoose.set("strictQuery",false)

export const dbconnection = asyncHandler( async ()=>{

        const{ connection } = await mongoose.connect( MONGO_URI )

        if (connection){
            console.log(`Connect to MongoDB : ${connection.host}`);
        }})
