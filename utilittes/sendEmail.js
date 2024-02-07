import nodemailer from "nodemailer"
import { asyncHandler } from "./asyncHandler.js";
import { AppError } from "../middlewares/appError.js";

export const sendEmail =  async (email, subject, message) => {

    // Create a transporter using SMTP or other transport methods
    const transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Configure mail options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to : email,
      subject : subject,
      html : message,
    };

    // Send the email
    const emailInfo = await transporter.sendMail(mailOptions);

    if(!emailInfo){
        next(new AppError("Error in send Mail" , 400))
    }

}

