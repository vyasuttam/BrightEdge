import { Router } from "express";
import { signupUser, loginUser, logoutUser, verifyUserOTP, resendOtp, getProfileInfo } from "../controllers/user.controllers.js";
import { checkAuth, verifyJWT } from "../middleware/verifyJWT.js"; 
import { upload } from "../middleware/multer.js";

export const userRouter = Router();

userRouter.post('/signup', upload.single("profile_image") ,signupUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', verifyJWT ,logoutUser);
userRouter.post('/resendOtp', resendOtp);
userRouter.post('/verifyOtp', verifyUserOTP);
userRouter.get('/checkAuth', checkAuth);

userRouter.get('/getProfileInfo', verifyJWT, getProfileInfo);