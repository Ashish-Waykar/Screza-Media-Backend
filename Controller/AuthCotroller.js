import UserModel from "../Models/UserModels.js";
import bcrypt from 'bcrypt';
import jwt  from "jsonwebtoken";

export const registerUser=async(req,res)=>{
    // const {username, password,first_name,last_name}=req.body ;
    
    // Password Encryption 
    const salt = await bcrypt.genSalt(10) 
    const hashedPass = await bcrypt.hash(req.body.password,salt) 


    // const newUser=new UserModel({
    //     username:req.body.username,
    //     password:hashedPass,
    //     first_name:req.body.first_name,
    //     last_name:req.body.last_name
    // })
    req.body.password=hashedPass
    const newUser=new UserModel(req.body)
    const {username}= req.body
    try {
        const oldUser= await UserModel.findOne({username})
        if(oldUser){
            return res.status(400).json({message:"User Already Exist !"})
        }
        const user =await newUser.save()
        const token =jwt.sign({
            username:user.username,
            id:user._id
        },process.env.JWT_key,{expiresIn:'1h'})
        res.status(200).json({user,token})
    } catch (error) {
        res.status(500).json({message:error.message})
         
    }
}

//Login Activity 
export const loginUser=async(req,res)=>{
    const {username,password}= req.body

    try {
        const user = await UserModel.findOne({username:username})

        if(user){
            const validity = await  bcrypt.compare(password,user.password)

            if(!validity){
                res.status(400).json("Wrong Password")
            }else{
            const token =jwt.sign({
                username:user.username,
                id:user._id
            },process.env.JWT_key,{expiresIn:'1h'})
            res.status(200).json({user,token})

            }
            // validity ? res.status(200).json(user):res.status(400).json("Wrong Password ");
        }
        else{
            res.status(404).json("User Does Not Exist ")
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}