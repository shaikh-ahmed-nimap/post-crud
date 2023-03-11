import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import {Op} from "sequelize";
import User  from "../db/models/user";
// import { IUser } from "../models/modelInterfaces";

export interface ICustomeRequest extends Request {
    user: User
};

export interface IJwtPayload extends JwtPayload {
    username: string;
    email: string;
}

const authenticateUser = async (req:Request, res:Response, next: NextFunction) => {
    console.log("runnig authenticate user")
    const {authToken} = req.cookies;
    if (!authToken) {
        res.status(404).send(
            'UnAuthorized'
        );
        return;
    }
    const decoded = verify(authToken, process.env.JWT_SECRET as string);
    const payload = decoded as IJwtPayload
    const user = await User.findOne({attributes: {exclude: ['password']}, where: {[Op.and]: {username: payload.username, email: payload.email}}});
    if (!user) {
        res.status(401).send('UnAuthorized');
        return;
    }
    (req as ICustomeRequest).user = user;
    
    next();
};



export default authenticateUser;