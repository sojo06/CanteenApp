import mongoose from "mongoose";
import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import axios from "axios"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import FormData from 'form-data'; // Import form-data package

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { sign } = jwt;
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId,role) => {
  return sign({ email, userId,role }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is required");
    }
    console.log(email);
    console.log(password);
    const user = await User.create({ email, password });
    const token = createToken(email, user._id,user.role)
    res.cookie("jwt",token , {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      
      user:{
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        activepasses:user.activepasses,
        token:token,
        role:user.role,
        image:user.image,
        studentid:user.studentid,

  
      } ,
      token:token
      
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};
export const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    if (!email || !password) {
      return res.status(400).send("Email and password is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Password is incorrect");
    }
    const token = createToken(email, user._id,user.role)
    res.cookie("jwt",  {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user:{
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        activepasses:user.activepasses,
        token:token,
        role:user.role,
        image:user.image,
        studentid:user.studentid,

  
      } ,
      token:token
      
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};
export const getUserInfo = async (req, res) => {
  try {
    console.log(req.userId);
    const email = req.email
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).send("User not found");
    }
    // console.log(userData)
    return res.status(200).json({
      
      user:{
        
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        activepasses:user.activepasses,
        studentid:user.studentid,
        role:user.role,
        image:user.image
      
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};
export const updateProfile = async (req, res) => {
  try {
    console.log("upf=d")
    const { userId } = req;
    const { firstName, lastName, studentId } = req.body;
    console.log(firstName)
    if (!firstName || !lastName) {
      return res.status(400).send("FirstName lastName and color is required");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstname:firstName,
        lastname:lastName,
        studentid:studentId
        
      },
      { new: true, runValidators: true }
    );
    // console.log(userData)
    return res.status(200).json({
    
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};
export const addProfileImage = async (req, res) => {
  try {
    console.log("profileimagecontroller");
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    const date = Date.now();
    // let filename = "uploads/profile";
    const updateduser = await User.findByIdAndUpdate(
      req.userId,
      { image: req.file.path },
      { new: true, runValidators: true }
    );
    console.log(updateduser)

    return res.status(200).json({
      // id:userData._id,
      // email:userData.email,
      // profilesetup:userData.profilesetup,
      // firstname:userData.firstname,
      // lastname:userData.lastname,
      // color:userData.color
      image: updateduser.image,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};

export const issuePass= async (req,res)=>{
  try {
    const studentid = req.body.studentId;
    if(!studentid){
      return res.status(400).send("Student id required");

    }
    const response = await User.findOne({studentid})
    if(response){
      return res.status(200).json({
        success:true
      })
    }
    else{
      return res.status(404).json({
        success:false
      })
    }
   
    
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error")
  }
}
export const getstudentdata = async (req,res)=>{
  try {
  const studentid = req.body.studentId;
  if(!studentid){
    return res.status(400).send("Student id required");

  }
  const response = await User.findOne({studentid})
  if(response){
    return res.status(200).json({
      studentData:{
        firstname:response.firstname,
        lastname:response.lastname,
        email:response.email,
        studentid:response.studentid,
        activepasses:response.activepasses,
      }
    })
  }
  else{
    return res.status(404).send("user not found")
      
    
  }
 
  
    
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error")

  }
}

export const faceVerification = async (req,res)=>{
  try {
    const path = req.file.path;
    console.log("inside")
    let rollno=req.body.studentid;
    if(path){
      const formData = new FormData();
            formData.append('image', fs.createReadStream(path));
            const flaskResponse = await axios.post(`${process.env.FLASK_API_ENDPOINT}/process-image`, formData,{
                 headers:formData.getHeaders(),
                });
                console.log(flaskResponse.data)
    
    const tempstr = flaskResponse.data.recognition_results[0].label
    const model_rollno = tempstr.split("_")[0]
    if(model_rollno==rollno){
      return res.json({
        success: true,
        results: flaskResponse.data,
      });
    }
    
    return res.json({
      success: false,
      results: flaskResponse.data,
    });
    
    }
  
    


  //   // Clean up the temporary file
  //   // fs.unlinkSync(filePath);

    
  
  } catch (error) {
    // console.log(error)
    return res.status(500).send("Internal server error")

  }
}