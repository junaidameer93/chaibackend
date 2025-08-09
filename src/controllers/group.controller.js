import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {Group} from '../models/group.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createGroup = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    console.log("name", name);
    console.log("description", description);
    if(!name || !description){
        throw new ApiError(400, "Please provide name and description");
    }

    const existedGroup = await Group.findOne({name});
    if(existedGroup){
        throw new ApiError(400, "Group name already exist");
    }

    const group = await Group.create({name, description});

    return res.status(200).json(new ApiResponse(200, group, "Group created successfully"));
})

const getAllGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find();
    if(!groups){
        throw new ApiError(404, "No groups found");
    }
    return res.status(200).json(groups);
})

const getUserGroups = asyncHandler(async (req, res) => {

    const {memberId} = req.params;
    
    if(!memberId){
        throw new ApiError(402,"User id is required")
    }

    const groups = await Group.find({members: memberId});
    //console.log("groups", groups);
    if(!groups){
        throw new ApiError(404, "No groups found");
    }
    return res.status(200).json(new ApiResponse(200, groups, "Groups fetched successfully"));
})

const getAllGroupUsers = asyncHandler(async (req, res) => {
    const {groupId} = req.params;
    if(!groupId){
        throw new ApiError(402,"Group id is required")
    }

    const group = await Group.findById(groupId).populate("members");
    if(!group){
        throw new ApiError(404, "No group found");
    }
    return res.status(200).json(new ApiResponse(200, group.members, "Group members fetched successfully"));
})

const leaveGroup = asyncHandler(async (req, res) => {
    const {groupId} = req.body;
    const userId = req.user._id;
    if(!groupId){
        throw new ApiError(402,"Group id is required")
    }
    const group = await Group.findById(groupId);
    if(!group){
        throw new ApiError(404, "No group found");
    }
    const isAlreadyMember = group.members.includes(userId);
    if (!isAlreadyMember) {
        throw new ApiError(400, "User is not a member of this group");
    }

    group.members.pull(userId);
    await group.save();

    return res.status(200).json(new ApiResponse(200, group, `You left the group "${group.name}"`));
})

const addMemberToGroup = asyncHandler(async (req, res) => {

    const {groupId, memberId} = req.body;
    if(!groupId || !memberId){
        throw new ApiError(402,"Group id and member id is required")
    }

    const group = await Group.findById(groupId);
        if (!group) {
        throw new ApiError(404, "No group found");
    }


    const isAlreadyMember = group.members.includes(memberId);
    if (isAlreadyMember) {
        throw new ApiError(400, "User is already member of this group");
    }
        
    group.members.push(memberId);
    await group.save();

    return res.status(200).json(new ApiResponse(200, group, "Group member added successfully"));

})
export {createGroup, getAllGroups, getUserGroups, getAllGroupUsers, addMemberToGroup, leaveGroup}