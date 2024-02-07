import { model, mongoose, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"

const userSchema = Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fill name feilds"],
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Fill email feilds"],
      unique: true,
      trim: true,
      lowercase: [true, "Enter in Lower case"],
    },

    password: {
      type: String,
      required: [true, "Fill password feilds"],
      minLenght: [8, "Password Should be atleast 8 character"],
      select: false,
    },

    avatar: {
      public_id : String,
      secure_url : String
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    forgetPasswordToken: String,

    forgetPasswordExpiry : String,
  },
  { timestamps: true }
);

// incription of password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJWTToken : async function () {
    return  jwt.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  comparePassword :  async function (plainpassword) {
    return await bcrypt.compare(plainpassword, this.password);
  },

  generatePasswordResetToken : async function (){
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.forgetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000

    return resetToken 

  }
};
export const userModel = model("User", userSchema);


