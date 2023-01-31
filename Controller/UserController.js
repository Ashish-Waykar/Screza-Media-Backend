import UserModel from "../Models/UserModels.js";
import bcrypt from "bcrypt"
import Jwt  from "jsonwebtoken";


//get All User 
export const getAllUsers= async(req,res)=>{
    try {
        let users =await UserModel.find();
        users =users.map((user)=>{
            const {password ,...otherDetails}=user._doc
            return otherDetails
        })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error)
    }
}


// get The User 
//localhost:27017/user/63798c0606380bab57de82f6
export const getUser=async(req,res)=>{
    const id = req.params.id;
try {
    const user= await UserModel.findById(id);
    
    if(user){
        const { password, ...otherDetails } = user._doc
        res.status(200).json(otherDetails)
    }else{
        res.status(404).json("No Such User exist")
    }
} catch (error) {
    res.status(500).json(error)
}
}
// Update User 
export const updateUser=async(req,res)=>{
    const id = req.params.id
    const {_id, currentUserAdminStatus, password}=req.body;
    if(id==_id){
        try {
            if(password){
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password,salt)
            }

            const user = await UserModel.findByIdAndUpdate(id,req.body,{new :true});
            const token = Jwt.sign(
                {usernameuser:user.username,id:user._id},
                process.env.JWT_key,
                {expiresIn:"1h"}
            );
            res.status(200).json({user,token})
        } catch (error) {
            req.status(500).json(error);
        }
    }else{
        res.status(403).json("Access Denied ! You Can Only Update Your Own Profile.")
    }

}

// Delete User
export const deleteUser =async(req,res)=> {
    const id = req.params.id
    const {currentUserId,currentUserAdminStatus}=req.body;
    if(currentUserId==id || currentUserAdminStatus){
        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User Deleted Successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access Denied ! You Can Only Delete Your Profile Only .")
    }

}
// Follow A User 
export const  followUser = async (req,res)=>{
    const id = req.params.id

    const{_id}=req.body

    if(_id==id){
        res.status(403).json("Action Forbidden !")
    }else{
        try {
            const followUser=await UserModel.findById(id)
            const followingUser =await UserModel.findById(_id)
            if (! followUser.followers.includes(_id)){
                console.log("Here ")
                await followUser.updateOne({$push:{followers:_id}})
                await followingUser.updateOne({$push:{following :id}})
                res.status(200).json("User Followed ! ")
            }else{
                res.status(403).json("User Is Already Followed By You ")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
} 

// UnFollow A User 
export const  unFollowUser = async (req,res)=>{
    const id = req.params.id

    const{_id}=req.body

    if(_id==id){
        res.status(403).json("Action Forbidden !")
    }else{
        try {
            const followUser=await UserModel.findById(id)
            const followingUser =await UserModel.findById(_id)
            if (followUser.followers.includes(_id)){
                console.log("Here ")
                await followUser.updateOne({$pull:{followers:_id}})
                await followingUser.updateOne({$pull:{following :id}})
                res.status(200).json("User Unfollowed ! ")
            }else{
                res.status(403).json("User Is Not Followed By You ")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
} 