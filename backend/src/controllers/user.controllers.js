import { z } from 'zod';
import validatePassword from '../utils/passwordValidator.js';
import { ApiErrorResponse } from '../utils/apiError.js';
import { user, userRoles } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { otpModel } from '../models/otp.model.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendMail, sendMailForForgetPassword } from '../email/sendMail.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { uploadToAppWrite } from '../config/Appwrite.js';
import { Enrollment } from '../models/enrollment.model.js';
import { Exam, ExamEnrollment } from '../models/exam.model.js';
import { courses } from '../models/course.model.js';
import mongoose from 'mongoose';

const signupSchema = z.object({
    full_name: z.string().min(5, "full name must be of length 5").regex(/[a-zA-z ]{5,}/, "please provide characters only"),
    email:z.string().email("email isn't valid"),
});

export async function signupUser(req, res){

    try {
        
        const { full_name, email, password } = req.body;

        const userData = signupSchema.safeParse({
            full_name,
            email,
        });

        if(!userData.success){
            throw new ApiErrorResponse(400, userData.error.issues[0].message)
        }

        const { status, message } = validatePassword(password);

        if(!status){
            throw new ApiErrorResponse(400, message);
        }

        const isUserExist = await user.findOne({
            email:email
        });

        if(isUserExist){
            throw new ApiErrorResponse(400, "user already exist");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await user.create({
            full_name: full_name,
            email: email,
            password: hashedPassword,
            profile_url:""
        });

        const created_role = await userRoles.create({
            user_id: createdUser._id,
            role_name: 'student'
        });

        if(!createdUser){
            throw new ApiErrorResponse(500, "user creation failed");
        }

        if(!created_role){
            throw new ApiErrorResponse(500, "user role creation failed");
        }

        // otp generate here

        const otpNumber = generateOTP();

        const newOtpObj = await otpModel.create({
            user_id: createdUser._id,
            otpNumber: otpNumber,
            expires:new Date(Date.now() + 5 * 60 * 1000)
        });

        sendMail(createdUser, otpNumber);

        return res.status(201).json({
            status:201,
            message:"user signed up successfull",
            createdUser,
            otp:newOtpObj.otpNumber
        });


    } catch (error) {

        return res.status(400).json(error);

    }
}

export function generateAccessToken(userData, roles){

    const token = jwt.sign(
        {
            user_id: userData._id,
            role: roles.role_name
        },
        process.env.ACESSTOKEN_SECRET,
        // {
        //     expiresIn:"24h"
        // }
    );
    
    return token;

}

export async function loginUser(req, res){

    try {
        
        const { email, password } = req.body;

        if(!email){
            throw new ApiErrorResponse(400, "email is empty");
        }

        if(!password){
            throw new ApiErrorResponse(400, "password is empty");
        }

        const isUserExist = await user.findOne({
            email: email,
        });

        if(!isUserExist){
            throw new ApiErrorResponse(400, "please signup first");
        }

        const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

        if(!isPasswordValid){
            throw new ApiErrorResponse(400, "password is wrong");
        }

        if(isUserExist.verified == false){
            return res.status(200).json({
                isVerified:false,
                message:'please verify the account'
            });
        }

        const roles = await userRoles.findOne({ user_id: isUserExist._id });

        console.log(roles);

        const accessToken = generateAccessToken(isUserExist, roles);

        const options = {
            httpOnly: true,
            secure:true
        }
        
        console.log(accessToken);

        return res.status(200).cookie("accessToken", accessToken, options)
        .json({
            status:200,
            message:"login successfull",
            userData: {
                _id: isUserExist._id,
                email: isUserExist.email,
                role: roles.role_name
            },
        });

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            error
        });
    }

}

export function logoutUser(req, res){

    return res.status(200).clearCookie('accessToken')
    .json({
        status:200,
        message:"logged out successfully"
    });

}

export async function updateRole(req, res){

    try {
        
        const { email, role } = req.body;

        const isUserExist = await user.findOne({
            email: email,
        });

        if(!isUserExist){
            throw new ApiErrorResponse(400, "user doesn't exist");
        }

        const updatedRole = await userRoles.updateOne({ user_id: isUserExist._id }, {
            $set:{
                role_name: role
            }
        });

        if(!updatedRole){
            throw new ApiErrorResponse(400, "role update failed");
        }

        return res.status(200).json({
            status:200,
            message:"role updated successfully"
        });

    } catch (error) {
        
    }

}

export async function resendOtp(req, res){

    try {

        const { email } = req.body;

        const isUserExist = await user.findOne({
            email: email,
        });
        
        const newOtp = generateOTP();

        const storedOtp = await otpModel.updateOne({ user_id: isUserExist._id }, {
            $set:{
                otpNumber: newOtp,
                expires:new Date(Date.now() + 5 * 60 * 1000)
            }
        });

        if(!storedOtp){
            throw new ApiErrorResponse(400, "otp isn't generated! please try after some time");
        }

        sendMail(isUserExist, newOtp);

        return res.status(200).json({
            status:200,
            message:'otp generated and sended to your mail successfully',
            newOtp: newOtp
        });

    } catch (error) {
        
        console.log(error);

        res.status(400).json(error);

    }

}

export async function verifyUserOTP(req, res){
    
    try {
        
        const { email, userOtp } = req.body;

        console.log(email, userOtp);

        const dbUser = await user.findOne({
            email: email,
        });

        if(!dbUser){
            throw new ApiErrorResponse(400, "signup first");
        }

        const dbOtp = await otpModel.findOne({
            user_id:dbUser._id
        });

        if(new Date(Date.now()) > dbOtp.expires){
            console.log(new Date(Date.now()) > dbOtp.expires);
            console.log(userOtp);
            throw new ApiErrorResponse(400, "otp expired");
        }

        if(userOtp !== dbOtp.otpNumber){
            console.log(userOtp);
            throw new ApiErrorResponse(400, "otp is invalid");
        }

        await user.updateOne({ _id: dbUser._id }, { $set: { verified: true } })

        return res.status(200).json({
            status:200,
            message:"user verified successfully",
        })

    } catch (error) {

        console.log(error);

        res.status(400).json(error);
    }

}

export const getProfileInfo = async (req, res) => {

    try {

        const userData = await user.findOne({
            _id: req.user_id
        }).select('-password -createdAt -updatedAt');

        const userRoleData = await userRoles.findOne({
            user_id : req.user_id
        });
        
        const userObject = userData.toObject();

        userObject.role = req.user_role; 
        userObject.work_experience = userRoleData.work_experience;
        userObject.qualification_doc = userRoleData.qualification_doc;
        
        return res.status(200).json({
            userData: userObject,
            status: 200
        });
        
    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            error:"error while getting info",
            status:400,
        })
    }

}

export const handleProfilePictureUpload = async (req, res) => {

    try {

        let image_url = "";

        // console.log("error before upload");

        // console.log(req.file);

        if (req.file && req.file.path) {
            image_url = await uploadToCloudinary(req.file.path, "profile_pictures", "image");
        }

        if(image_url)
        {
            const updatedUser = await user.updateOne({ _id: req.user_id }, 
                { 
                    $set: { 
                        profile_url: image_url 
                    }    
                });

            if(updatedUser){
                return res.status(200).json({
                    status:200,
                    message:"profile picture updated successfully",
                    imageUrl:image_url
                });
            }
        }


    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            error:"error while uploading profile picture",
            status:400,
        })

    }


}

export const handleForgetPassword = async (req, res) => {

    
        try {
    
            const { user_id, new_password } = req.body;
    
            const dbUser = await user.findOne({
                _id : user_id,
            });
    
            if(!dbUser){
                throw new ApiErrorResponse(400, "user doesn't exist");
            }
    
            const hashedPassword = await bcrypt.hash(new_password, 10);
    
            const updatedUser = await user.updateOne({ _id: dbUser._id }, 
                { 
                    $set: { 
                        password: hashedPassword 
                    }    
                });
    
            if(updatedUser){
    
                console.log('password changed success');
    
                return res.status(200).json({
                    status:200,
                    message:"password updated successfully",
                });
            }
            
        } catch (error) {
            
            console.log(error);
    
            return res.status(400).json({
                error:error.message || "error while updating password",
                status:400,
            })
    
        }

}


export const handleForgetPasswordRequest = async (req, res) => {

    try {

        const { email } = req.body;

        const dbUser = await user.findOne({
            email: email
        });

        if(!dbUser){
            throw new ApiErrorResponse(400, "user doesn't exist");
        }

        sendMailForForgetPassword(dbUser);

        return res.status(200).json({
            status:200,
            message:"verification link it sent to your email",
        });

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            error:error.message || "error while generating otp",
            status:400,
        })

    }

}   

export const handleChangePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

        const dbUser = await user.findOne({
            _id: req.user_id
        });

        const isPasswordValid = await bcrypt.compare(oldPassword, dbUser.password);

        if(!isPasswordValid){
            throw new ApiErrorResponse(400, "old password is wrong");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await user.updateOne({ _id: req.user_id }, 
            { 
                $set: { 
                    password: hashedPassword 
                }    
            });

        if(updatedUser){

            console.log('password changed success');

            return res.status(200).json({
                status:200,
                message:"password updated successfully",
            });
        }
        
    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            error:error.message || "error while updating password",
            status:400,
        })

    }

}

export const handleProfileUpdate = async (req, res) => {

    try {
        
        let { full_name, qualification_doc } = req.body;

        const new_doc = req.file;

        if(new_doc) {
            qualification_doc = await uploadToAppWrite(new_doc);
        }

        const updatedUser = await user.updateOne({ _id: req.user_id }, 
            { 
                $set: { 
                    full_name: full_name,
                }    
            });

        const { work_experience } = req.body;

        await userRoles.updateOne({
            user_id : req.user_id
        }, {
            $set : {
                work_experience : work_experience,
                qualification_doc : qualification_doc
            }
        })

        if(updatedUser){
            return res.status(200).json({
                status:200,
                message:"profile updated successfully",
            });
        }

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            error:"error while updating profile",
            status:400,
        })

    }

}

export async function upgradeRole(req, res) {

    try {
        
        const { aadharNumber, work_experience } = req.body;

        const qualification_doc = req.file;
        
        if(!aadharNumber) {
            return ;
        }

        if(aadharNumber.length != 12){
            throw new Error("please enter valid number");
        }

        if(!qualification_doc){
            throw new Error("please upload qualification document");
        }

        const uploadedUrl = await uploadToAppWrite(qualification_doc);

        if(!uploadedUrl){
            throw new Error("error while uploading document");
        }

        await userRoles.updateOne({
            user_id:req.user_id
        }, {
            $set : {
                role_name:"instructor",
                identityNumber: aadharNumber,
                work_experience: work_experience || "",
                qualification_doc: uploadedUrl
            }
        });

        const userObj = await user.findById(req.user_id);

        const roles = await userRoles.findOne({ user_id : req.user_id });

        const accessToken = generateAccessToken(userObj, roles);

        const options = {
            httpOnly: true
        }
        
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json({
            message: "upgraded role successfully"
        });

    } catch (error) {
        
        return res.status(400).json({
            message: error.message
        });

    }

}

export const getUserStats = async (req, res) => {

    try {
        
        const userrole = req.user_role;

        const enrolledCourseCount = await Enrollment.countDocuments({
            student_id : req.user_id
        });

        const enrolledExamsCount = await ExamEnrollment.countDocuments({
            user_id : req.user_id
        });

        let totalCourseCount;
        let totalExamCount;
        let totalEnrolledStudents;
        let courseStats;

        let statsObj = {            
            enrolledCourseCount,
            enrolledExamsCount
        };


        if(userrole == "instructor")
        {
            totalCourseCount = await courses.countDocuments({
                instructor_id : req.user_id
            });

            
            const courseStats = await Enrollment.aggregate([
                // Lookup course details
                {
                  $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "courseDetails"
                  }
                },
                { $unwind: "$courseDetails" },
              
                // Match only the instructor's courses
                {
                  $match: {
                    "courseDetails.instructor_id": new mongoose.Types.ObjectId(req.user_id)
                  }
                },
              
                // Group by course and compute totals
                {
                  $group: {
                    _id: "$course_id",
                    totalStudents: { $sum: 1 },
                    courseDetails: { $first: "$courseDetails" }
                  }
                },
              
                // Project final result
                {
                  $project: {
                    course_name: "$courseDetails.course_name",
                    price: "$courseDetails.price",
                    totalStudents: 1,
                    totalEarnings: { $multiply: ["$totalStudents", "$courseDetails.price"] }
                  }
                }
              ]);
              
            //   console.log(courseStats);

              
              totalExamCount = await Exam.countDocuments({
                  user_id : req.user_id
              });
              
                statsObj = {
                    ...statsObj,
                    totalCourseCount,
                    totalExamCount,
                    totalEarnings : courseStats.reduce((acc, courseStat) => acc + courseStat.totalEarnings, 0)
                }
        }

        return res.status(200).json({
            success : true,
            data : statsObj
        });


    } catch (error) {

        return res.status(400).json({
            message: error.message
        }); 
    }

}

export const getInstructorInfo = async (req, res) => {

    try
    {
        const { instructor_id } = req.query;

        const dbData = await userRoles.findOne({
            user_id : instructor_id
        }).populate('user_id');

        console.log(dbData);

        const data = {
            user_id : dbData.user_id._id,
            profile_url : dbData.user_id.profile_url,
            email : dbData.user_id.email,
            name : dbData.user_id.full_name,
            work_experience : dbData.work_experience,
            qualification_doc : dbData.qualification_doc
        }

        return res.status(200).json({
            success : true,
            data : data
        });

    }
    catch(error)
    {
        return res.status(400).json({
            success : false,
            message : error.message
        });
    }

}