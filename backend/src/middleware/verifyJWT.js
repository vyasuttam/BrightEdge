import { ApiErrorResponse } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import {user} from '../models/user.model.js';

export function verifyJWT(req, res, next){

    try {
        
        const userToken = req.cookies.accessToken;

        if(!userToken){
            throw new ApiErrorResponse(401, "token is empty");
        }

        const isValid = jwt.verify(userToken, process.env.ACESSTOKEN_SECRET);

        if(!isValid){
            throw new ApiErrorResponse(400, "token is invalid");
        }

        // console.log(isValid);

        req.user_id = isValid.user_id;
        req.user_role = isValid.role;

        next();

    } catch (error) {
        
        res.status(400).json(error);
    }

}

export const verifyAdmin = async (req, res, next) => {
    
    try {
        
        const token = req.headers['authorization']; // Get token from the Authorization header
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
    
        const tokenParts = token.split(' '); // Split to get the token part after "Bearer"
        const accessToken = tokenParts[1];

        const isValid = jwt.verify(accessToken, process.env.ACESSTOKEN_SECRET);

        if(!isValid){
            throw new ApiErrorResponse(400, "token is invalid");
        }

        // console.log(isValid);

        req.user_id = isValid.user_id;
        req.user_role = isValid.role;

        next();

    } catch (error) {
        
        res.status(400).json(error);
    }


}

export const checkAuth = async (req, res) => {

    try {

        const userToken = await req.cookies.accessToken;

        // console.log(userToken + ' from checkauth');

        if(!userToken){
            return res.status(401).json({
                userData:null,
                status:401
            });
        }

        const isValid = jwt.verify(userToken, process.env.ACESSTOKEN_SECRET);

        // console.log(isValid);

        if(!isValid){
            return res.status(401).json({
                userData:null,
                status:401
            });
        }

        // console.log(isValid.user_id);

        const userData = await user.findOne({
            _id: isValid.user_id 
        }).select('-password -createdAt -updatedAt -role');

        // console.log(userData);

        return res.status(200).json({
            userData,
            status:200
        });

    } catch (error) {
  
        res.status(400).json({
            error,
            message: "this is errorr"
        });
    }

}