import mongoose from "mongoose";
const passSchema = new mongoose.Schema({


    studentid:{
        required:true,
        type:String,

    },
    email:{
        required:[true,"Email is required"],
        type:String,
        unique:true

    },
    passid:{
        required:true,
        type:string,

    },
    isactive:{
        type:Boolean,
        required:true,
        default:true,
    },
    
})

const Pass = mongoose.model("passes",passSchema)
export default Pass