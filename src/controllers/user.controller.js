import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessTokenAndRefreshToken = async(userId) => {
    
    
   try {
    const user = await User.findById(userId);
    
    //These methods are created in user model
    const accessToken = user.accessToken = user.generateAccessToken()
    const refreshToken = user.refreshToken = user.generateRefreshToken()
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
     user.refreshToken = refreshToken;
 
     //validateBeforeSave is set to false to skip validation
     await user.save({ validateBeforeSave: false });
     return { accessToken, refreshToken };

   } catch (error) {
        throw new ApiError(500, "Failed to generate tokens");
   }
}

const registerUser = asyncHandler(async (req, res) => {
    
    const { fullname, username, email, password} = req.body;

    if([fullname,email,username,password].some((field)=>{
        field?.trim() === "";
    })){
        throw new ApiError(400, "Please fill in all fields"); 
    }

    const existedUser =  await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({username,email,fullname,password});

    // remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Failed to register user");
    }

    return res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password} = req.body;

    if(!(username || email)){
        throw new ApiError(400, "Please provide username or email");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new ApiError(400, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
       httpOnly: true,
        secure: false, 
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }    

    return res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    }

    res.status(200)
    .clearCookie("refreshToken", null, options)
    .clearCookie("accessToken", null, options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));

})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!refreshToken){
        throw new ApiError(401, "Unauthorized request - No token provided");
    }

    try {
        const decodedUserInfo = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedUserInfo.id).select("-password");
    
        if(!user){
            throw new ApiError(401, "Unauthorized request - Invalid token");
        }
    
        if(refreshToken !== user.refreshToken){
            throw new ApiError(401, "Unauthorized request - Token is expired or used");
        }
    
        const { accessToken, refreshTokenNew } = await generateAccessTokenAndRefreshToken(user._id);
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshTokenNew, options)
        .json(new ApiResponse(200, 
            {
                accessToken, refreshToken: refreshTokenNew
            },
            "Access token refreshed successfully"
        ));

    } catch (error) {
        throw new ApiError(401, "Unauthorized request - Invalid token");
    }
    
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, "_id fullname");
    if(!users){
        throw new ApiError(404, "No users found");
    }
    return res.status(200).json(users);
})

export { registerUser, loginUser, logOutUser, refreshAccessToken, getUser, getAllUsers }