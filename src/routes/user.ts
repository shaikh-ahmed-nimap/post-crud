import {Router} from "express";
import { createUser, getUsers, login, getUser, logout, changeUserPassword, sendToken, resetPassword } from "../controllers/user";
import {authenticateUser} from "../middlewares";

const userRouter = Router();

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/login').post(login);
userRouter.route('/current').get(authenticateUser, getUser);
userRouter.route('/current/logout').post(authenticateUser, logout);
userRouter.route('/current/change-password').patch(authenticateUser, changeUserPassword);
userRouter.route('/get-reset-token').post(sendToken);
userRouter.route('/reset-password/:token').post(resetPassword);

export default  userRouter;