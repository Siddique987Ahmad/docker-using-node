const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const signup=async(req,res)=>{
    try {
        const {userName,password}=req.body
        const hashPassword=await bcrypt.hash(password,12)
        const user=await User.create({
            userName,
            password:hashPassword,
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            status:"fail",

        })
    }
}
const login=async(req,res)=>{
    try {
        const {userName,password}=req.body
        const user=await User.findOne({userName})
        console.log(user)
        if (!user) {
            
           return res.status(404).json("user not found")
        }
        const isCorrect=await bcrypt.compare(password,user.password)
        console.log(isCorrect)
        if (isCorrect) {
            req.session.user=user
            res.status(200).json({
                status:"success",
                //data:user
        })
        } else {
            res.status(404).json("username or password incorrect")
        }

    } catch (error) {
        console.error("Error during login:", error); // Log the actual error
        res.status(400).json({
            status:"fail",
            error: error.message, // Return the error message for debugging
        })
    }
}

module.exports={signup,login}