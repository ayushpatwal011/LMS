
export const sendToken = async (res , user , message , statusCode = 200) => {
    const token = await user.generateJWTToken()

    const cookieOption = {
        //  for 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true,
      };    

    res.status(statusCode).cookie("token" , token , cookieOption).json({
        success:true,
        message,
        user
    })
}