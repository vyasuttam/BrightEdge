import { z } from 'zod';
import validatePassword from '../utils/passwordValidator.js';
import { ApiErrorResponse } from '../utils/apiError.js';
import { user, userRoles } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { otpModel } from '../models/otp.model.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendMail } from '../email/sendMail.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

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

function generateAccessToken(userData, roles){

    const token = jwt.sign(
        {
            user_id: userData._id,
            role: roles.role_name
        },
        process.env.ACESSTOKEN_SECRET,
        {
            expiresIn:"24h"
        }
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

        const accessToken = generateAccessToken(isUserExist, roles);

        const options = {
            httpOnly: true
        }
        
        console.log(accessToken);

        return res.status(200).cookie("accessToken", accessToken)
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
        
        const userObject = userData.toObject();

        userObject.role = req.user_role; 
        
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

        console.log("error before upload");

        console.log(req.file);

        if (req.file && req.file.path) {
            image_url = await uploadToCloudinary(req.file.path, "profile_pictures");
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
        
        const { full_name } = req.body;

        const updatedUser = await user.updateOne({ _id: req.user_id }, 
            { 
                $set: { 
                    full_name: full_name,
                }    
            });

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