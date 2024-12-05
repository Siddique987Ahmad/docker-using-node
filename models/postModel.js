const mongoose=require('mongoose')

const postSchema=mongoose.Schema({

    title:{
        type:String,
        require:[true,"post must have title"]
    },
    body:{
        type:String,
        require:[true,"post must have body"]
    }

},{timestamps:true})

module.exports=mongoose.model("Post",postSchema)