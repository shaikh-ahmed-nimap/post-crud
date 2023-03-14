import {Router} from "express";
import { createUser, getUsers, login, getUser, logout, changeUserPassword, sendToken, resetPassword, uploadProfilePic, makeFollowRequest } from "../controllers/user";
import {authenticateUser} from "../middlewares";
import validateMiddle from "../middlewares/validateMiddle";
import upload from "../multer-config";

const userRouter = Router();

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/login').post(login);
userRouter.route('/current').get(authenticateUser, getUser);
userRouter.route('/current/logout').post(authenticateUser, logout);
userRouter.route('/current/change-password').patch(authenticateUser, changeUserPassword);
userRouter.route('/current/get-reset-token').post(sendToken);
userRouter.route('/current/reset-password/:token').post(resetPassword);
userRouter.route('/current/change-profile').post(authenticateUser, upload.single('profilePic'), uploadProfilePic);
userRouter.route('/current/follow').post(authenticateUser, makeFollowRequest);

export default  userRouter;