import { Router } from "express";
import { createGroup, getAllGroups, getUserGroups, getAllGroupUsers, addMemberToGroup, leaveGroup} from '../controllers/group.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router = Router();

router.route("/").get(verifyJWT, getAllGroups);
router.route("/create-group").post(verifyJWT,createGroup);
router.route("/member/:memberId").get(verifyJWT, getUserGroups);
router.route("/group/:groupId").get( verifyJWT,getAllGroupUsers);
router.route("/add-member").post(verifyJWT, addMemberToGroup);
router.route("/leave-group").post(verifyJWT, leaveGroup);


export default router;