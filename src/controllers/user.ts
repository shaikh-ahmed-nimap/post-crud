import {Request, Response, NextFunction} from "express";
import {ICustomeRequest, IJwtPayload} from "../middlewares/authenticate"
import {compare, genSalt, hash} from "bcrypt";
import {sign} from "jsonwebtoken";
import { IUser } from "../models/modelInterfaces";
import { User } from "../models";
import { tryCatch } from "../middlewares";
import {validateUser} from "../validators";
import { createSecretKey } from "crypto";

export const getUsers = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    res.status(200).json({status: "success", data: User.UserData})
    return;
})

export const createUser = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    const body:IUser = req.body;
    const {error, value} = validateUser(body);
    if (error) {
        res.status(400).json({status: "fail", data: error.details});
        return;
    }
    const user = User.UserData.find((user:IUser) => user.username === body.username || user.email === body.email);
    if (user) {
        let error;
        if (user.username === body.username) {
            error = {
                "message": "username is in use",
                "path": [
                    "username"
                ],
                "type": "any.unique",
                "context": {
                    "label": "username",
                    "key": "username"
                }
            }
        } else {
            error = {
                "message": "email is in use",
                "path": [
                    "email"
                ],
                "type": "any.unique",
                "context": {
                    "label": "email",
                    "key": "email"
                }
            }
        }
        res.status(400).json({status: 'fail', data: error});
        return;
    };
    const salt = await genSalt(10);
    const hashedPassword = await hash(value.password, salt);
    value.password = hashedPassword;
    const newUser = new User(value);
    User.UserData.push(newUser);
    const userToSend = {firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, username: newUser.username, profilePic: newUser.profilePic};
    res.status(201).json({status:'fail', data: userToSend});
    return;
});

export const login = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    const body:{username: string, password: string} = req.body;
    let error = [];
    if (!body.username) {
        const err = {
            "message": "username or email is required",
            "path": [
                "username"
            ],
            "type": "any.required",
            "context": {
                "label": "username",
                "key": "username"
            }
        };
        error.push(err);
    }
    if (!body.password) {
        const err = {
            "message": "password is required",
            "path": [
                "password"
            ],
            "type": "any.unique",
            "context": {
                "label": "password",
                "key": "password"
            }
        };
        error.push(err);
    };
    if (error.length) {
        res.status(400).json({status: "fail", data: error});
        return;
    }
    let user = User.UserData.find((user:IUser) => user.email === body.username || user.username === body.username);
    if (!user) {
        const err = {
            "message": "invalid username or password",
            "path": [
                "invalid"
            ],
            "type": "any.invalid",
            "context": {
                "label": "invalid",
                "key": "invalid"
            }
        };
        res.status(400).json({status: "fail", data: err});
        return;
    };
    const passwordIsCorrect = await compare(body.password, user.password);
    if (!passwordIsCorrect) {
        const err = {
            "message": "invalid username or password",
            "path": [
                "invalid"
            ],
            "type": "any.invalid",
            "context": {
                "label": "invalid",
                "key": "invalid"
            }
        };
        res.status(400).json({status: "fail", data: err});
        return;
    }
    const jwtPayload = {username: user.username, email: user.email}
    const webToken = sign(jwtPayload, "somesecretkey@#fkdasl#dkdi#", {
        expiresIn: '1d',
    });
    res.cookie("authToken", webToken, {httpOnly: true});
    res.status(200).send('login success')
    return;
});

export const getUser = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    console.log("running getUser");
    const user = (req as ICustomeRequest).user;
    res.status(200).json({status: "success", data: user})
    return;
})

export const logout = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    res.clearCookie('authToken');
    res.status(200).send("logout success");
    return;
});
