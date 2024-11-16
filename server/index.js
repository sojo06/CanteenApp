import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/authroutes.js"
dotenv.config()
const app = express()
const port = process.env.port
const mongoUrl = process.env.MONGO_URL
app.use(cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}));    
app.use("/uploads",express.static("uploads"));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' })); // Allow large base64 strings
app.use('/api/auth',authRoutes)

mongoose.connect(mongoUrl).then(()=>{
    console.log("Connected to Database Successfully");
    
})
const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
})