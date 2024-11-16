import { genSalt,hash } from "bcrypt";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    email:{
        required:[true,"Email is required"],
        type:String,
        unique:true

    },
    password:{
        required:[true,"password is required"],
        type:String,

    },
    firstname:{
        required:false,
        type:String,

    },
    lastname:{
        required:false,
        type:String,

    },
    image:{
        required:false,
        type:String,

    },
    studentid:{
        // required:[true,"Student ID is required"],
        type:String,

    },
    profilesetup:{
        type:Boolean,
        default:false

    },
    activepasses:{
        required:false,
        type:Number,
        default:0,

    },
    role:{
        type:String,
        required:false,
        default:"student"
    }
})
userSchema.pre("save",async function (next) {
    const salt = await genSalt();
    this.password = await hash(this.password,salt);
    next();
})
const User = mongoose.model("Users",userSchema)
export default User