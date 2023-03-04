import {Router} from "express";
import { createUser, getUsers, login, getUser, logout } from "../controllers/user";
import {authenticateUser} from "../middlewares";

const userRouter = Router();

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/login').post(login);
userRouter.route('/current').get(authenticateUser, getUser);
userRouter.route('/current/logout').post(authenticateUser, logout)

export default  userRouter;