import { Router } from "express";
import { signupUser, loginUser, logoutUser, verifyUserOTP, resendOtp, getProfileInfo, handleProfilePictureUpload, handleChangePassword, handleProfileUpdate, updateRole, upgradeRole, handleForgetPassword, handleForgetPasswordRequest, getUserStats } from "../controllers/user.controllers.js";
import { checkAuth, verifyJWT } from "../middleware/verifyJWT.js"; 
import { upload } from "../middleware/multer.js";
import { userRole } from "../middleware/instructorRole.js";
import { getCourseStatus } from "../controllers/course.controllers.js";

export const userRouter = Router();

userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', verifyJWT ,logoutUser);
userRouter.post('/resendOtp', resendOtp);
userRouter.post('/verifyOtp', verifyUserOTP);
userRouter.get('/checkAuth', checkAuth);

userRouter.get('/getProfileInfo', verifyJWT, getProfileInfo);
userRouter.post('/uploadProfilePicture', verifyJWT, upload.single("profile_image"), handleProfilePictureUpload);

userRouter.post('/changePassword', verifyJWT, handleChangePassword);
userRouter.post('/forget-password-request', handleForgetPasswordRequest);
userRouter.post('/reset-password', handleForgetPassword);

userRouter.post('/upgradeRole', verifyJWT, upload.single("qualification_doc"), upgradeRole)

userRouter.post('/updateProfile', verifyJWT, upload.single('qualification_doc') ,handleProfileUpdate);

userRouter.get('/userRole', verifyJWT, userRole);
userRouter.get('/get-user-stats', verifyJWT, getUserStats);