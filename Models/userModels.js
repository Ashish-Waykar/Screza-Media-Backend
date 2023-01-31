import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username:{
            type : String,
            required : true
        },
        password:{
            type : String,
            required : true
        },
        first_name:{
            type : String,
            required : true
        },
        last_name:{
            type : String,
            required : true
        },
        is_admin:{
            type : Boolean,
            default:false
        },
        profile_picture:String,
        cover_picture:String,
        about:String,
        lives_in:String,
        works_at:String,
        country:String,
        relationship:String,
        followers:[],
        following:[]
        

    },
    { timestamps:true }
)
const UserModel = mongoose.model("user",userSchema);
export default UserModel;