import {model , Schema} from "mongoose"

export const courseModel = new Schema({
    title:{
        type:String,
        require:true,
        minLength:[4,"Discription must be atleast 4 character"],
        maxLength:[20,"Discription should be less than 4 character"],
        trim:true
    },
    decription:{
        type:String,
        require:true,
        minLength:[10,"Discription must be atleast 4 character"],
        maxLength:[200,"Discription should be less than 4 character"],
        trim:true
    },
    category:{
        type:String,
        require:[true,"Select the category of lacture "]
    },
    thumbnial:{
        public_id:{
            type:String,
            require:true
        },
        secure_url:{
            type:String,
            require:true
        }
    },
    lecture:[
        {
            title:String,
            discription:String,
            lecture:{
                public_id:{
                    type:String,
                },
                secure_url:{
                    type:String,
                }
            }
        }
    ],
    numberOFLecture : {
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        require:[true,"Enter the name of creater"]
    }
},{timestamps : true})