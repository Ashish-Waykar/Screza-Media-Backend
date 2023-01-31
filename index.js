import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import AuthRoute from './Routes/AuthRoute.js'
import PostRoute from './ROutes/postRoute.js' 
import UserRoute from './Routes/UserRoute.js'
import UploadRoute from './Routes/UploadRoute.js'
// Routes

// Middlewares 
const app=express();
// to server an images to public server 
app.use(express.static('public'))
app.use('/images',express.static("images"))

app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
app.use(cors());

// .env setup
dotenv.config();
  
// My LocalHost Setup

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true },)
.then(()=>app.listen(process.env.PORT,()=>
console.log('Listning On : ',process.env.PORT),),)
.catch((error)=> console.log(error));

// const conSuccess = mongoose.connection
// conSuccess.once('open', _ => {
//   console.log('Database connected:', process.env.MONGO_DB) ;
//   // console.log('Listning On Port :', process.env.MONGO_DB) ;
// }) 

//usage of Route
app.use('/auth',AuthRoute)
app.use('/user',UserRoute)
app.use('/post',PostRoute)
app.use('/upload',UploadRoute)