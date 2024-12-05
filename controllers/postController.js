const Post=require('../models/postModel')

const getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(400).json({
            status:"fail",

        })
    }
}
const getOnePost=async(req,res)=>{
    try {
        const {id}=req.params
        const post=await Post.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({
            status:"fail",

        })
    }
}

const createPost=async(req,res)=>{
    try {
        const {title,body}=req.body
        const post=await Post.create({
            title,
            body,
        })
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({
            status:"fail",

        })
    }
}

const updatePost=async(req,res)=>{
    try {
        const {id}=req.params
        const {title,body}=req.body
        const post=await Post.findByIdAndUpdate(id,
            {$set:{
                title,
                body
            }},{
            new:true,
            runValidators:true
        })
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({
            status:"fail",

        })
    }
}
const deletePost=async(req,res)=>{
    try {
        const {id}=req.params
        const post=await Post.findByIdAndDelete(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({
            status:"fail",

        })
    }
}

module.exports={getAllPosts,getOnePost,createPost,updatePost,deletePost}