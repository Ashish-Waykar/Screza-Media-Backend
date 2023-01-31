import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/UserModels.js";

// create New Post 
export const createPost = async(req,res)=> {
    const newPost= new PostModel(req.body)
    try {
        await newPost.save()
        res.status(200).json(newPost) 
    } catch (error) {
        res.status(500).json(error)
    }

}

// get A Post 
export const getPost = async(req, res )=> {
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
        
    } 
}

// Update Post
export const updatePost= async (req,res)=> {
    const postID=req.params.id
    const {userId}=req.body
    try {
        const post=  await PostModel.findById(postID)
        if(post.userId==userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post Updated")

        } else{
            res.status(403).json("Action Forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// Delete A Post
export const deletePost=async (req,res)=>{
    const id = req.params.id;
    const {userId}=req.body
    try {
        const post =await PostModel.findById(id)
        if(post.userId==userId){
            await post.deleteOne();
            res.status(200).json("Post Deleted Successfully")
        }else{
            res.status(403).json("Acction Forbidden !")
        }
    } catch (error) {
        req.status(500).json(error)
    } 
}
// Like And Dislike A Post 
export const likePost= async (req,res)=>{
    const id = req.params.id
    const {userId}=req.body
    try {
        const post =await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{ likes:userId }})
            res.status(200).json("Post Liked ")
        }else{
            await post.updateOne({$pull:{ likes:userId }})
            res.status(200).json("Post Unliked ")
            
        }

    }catch(error){
        res.status(500).json(error)
    }
}

// get TimeLine Post
export const getTimelinePosts= async (req,res )=>{
    const userId= req.params.id
    try {
        const currentUserPosts= await PostModel.find({userId:userId})
        // aggregate is function which carry multiple functions
        const following=await UserModel.aggregate([{
            $match:{
                _id:new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup :{
                from : "posts",
                localField:"following",
                foreignField:"userId",
                as:"followingPosts"

            }
        },{
            $project:{
                followingPosts:1,
                _id:0
            }
        }
    ])
    res.status(200)
    .json(currentUserPosts.concat(...followingPosts[0].followingPosts))
    .sort((a,b)=>{
        return b.createdAt - a.createdAt
    })
    } catch (error) {
        res.status(500).json(error)
    }
}