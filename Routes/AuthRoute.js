import express, { response } from 'express';
import { loginUser, registerUser } from '../Controller/AuthCotroller.js';


const router =express.Router()
// router.get('/',async(req,res)=>{res.send("Authentication Route ")})
router.post('/register',registerUser)
router.post('/login',loginUser)
export default router