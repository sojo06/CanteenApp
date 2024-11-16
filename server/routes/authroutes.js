import {Router} from "express";
import { login, signup, getUserInfo,updateProfile,addProfileImage, issuePass, getstudentdata, faceVerification} from "../controllers/authcontroller.js";
import { verifyToken } from "../middlewares/authmiddleware.js";
import multer from "multer";
const authRoutes = Router();
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./uploads/profile")
    },
    filename: function(req,file,cb){
        return cb(null,`${Date.now()}_${file.originalname}`)
    }

});
const upload = multer({storage});
const flaskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, "./uploads/flask_images"); // Separate directory for Flask images
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  const flaskUpload = multer({ storage: flaskStorage });

authRoutes.post("/signup",signup);
authRoutes.post("/login",login)
// authRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"),addProfileImage)
authRoutes.get('/getuserinfo',verifyToken,getUserInfo)
authRoutes.post('/updateprofile',verifyToken,updateProfile)
authRoutes.post('/updateprofileimage',verifyToken,upload.single("profilePicture"),addProfileImage)
authRoutes.post('/issuepass',verifyToken,issuePass)
authRoutes.post('/getstudentdata',verifyToken,getstudentdata)
authRoutes.post('/face-verify',verifyToken,flaskUpload.single("image"),faceVerification)
export default authRoutes