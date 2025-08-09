import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {  
    try {
        //Check if the token is present in the request
        //check req header for mobile app scenario
        //check req cookies for web app scenario
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        if(!token){
            return next(new ApiError(401, "Unauthorized request - No token provided"));
        }
        const decodedUserInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        //decodedUserInfo.id from generateAccessToken method in user model
        const user = await User.findById(decodedUserInfo.id).select("-password -refreshToken");
    
        if(!user){
            return next(new ApiError(401, "Unauthorized request - Invalid token"));
        }
        
        req.user = user;
        next();
    } catch (error) {   
        return next(new ApiError(401, "Unauthorized request - Invalid token"));
    
    }
})