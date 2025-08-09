import { Router } from "express";
import { registerUser, loginUser, logOutUser, refreshAccessToken, getUser, getAllUsers } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router = Router();

router.route("/").get(verifyJWT, getAllUsers);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-current-user").get(verifyJWT, getUser)


export default router;