import jwt from "jsonwebtoken";
export const verifyToken = (req,res,next)=>{
    // console.log(req.cookies) 
    // console.log("hi")
    // const token = req.data.token;
    console.log("middl")
   const token = req.headers.token
    //  console.log(token)
    if(!token){
        // console.log("bi")
        return res.status(401).send("Please login");

    }
    jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
        if(err) {
            console.log(err);
            
            return res.status(403).send("Token is not valid")};
        req.userId = payload.userId;
        req.role = payload.role
        req.email = payload.email
        // console.log(payload.userId)
        // console.log(req.userId)

        next();
    })
}

