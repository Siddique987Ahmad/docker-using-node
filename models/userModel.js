const mongoose=require('mongoose')

const userSchema=mongoose.Schema({

    userName:{
        type:String,
        require:[true,"user must have username"],
        unique:true
    },
    password:{
        type:String,
        require:[true,"user must have password"]
    }

},{timestamps:true})

module.exports=mongoose.model("User",userSchema)