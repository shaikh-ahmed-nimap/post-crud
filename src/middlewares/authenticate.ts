import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models";
import { IUser } from "../models/modelInterfaces";

export interface ICustomeRequest extends Request {
    user: string | JwtPayload
};

export interface IJwtPayload extends JwtPayload {
    username: string;
    email: string;
}

const authenticateUser = async (req:Request, res:Response, next: NextFunction) => {
    console.log("runnig authenticate user")
    const {authToken} = req.cookies;
    console.log(authToken);
    if (!authToken) {
        res.status(404).send(
            'UnAuthorized'
        );
        return;
    }
    const decoded = verify(authToken, "somesecretkey@#fkdasl#dkdi#");
    const payload = decoded as IJwtPayload
    const user = User.UserData.find((user:IUser) => user.username === payload.username);
    if (!user) {
        res.status(401).send('UnAuthorized');
        return;
    }
    const userToSend = {firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username, profilePic: user.profilePic};
    (req as ICustomeRequest).user = userToSend;
    next();
};



export default authenticateUser;