import {Request, Response, NextFunction} from "express";
import {Op, UniqueConstraintError} from "sequelize";
import {ICustomeRequest, IJwtPayload} from "../middlewares/authenticate"
import {compare, genSalt, hash} from "bcrypt";
import {sign} from "jsonwebtoken";
import { IUser } from "../models/modelInterfaces";
import User from "../db/models/user";
// import { User } from "../models";
import { tryCatch } from "../middlewares";
import {validateUser, userPasswordChangeValidation} from "../validators";
import {createValidationErr} from "../helper/validationError";
import sendMail from "../helper/sendMail";

import crypto from "crypto";

export const getUsers = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    let data = await User.findAndCountAll();
    res.status(200).json({status: "success", data: User.findAll()})
    return;
})

export const createUser = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    const body:typeof User = req.body;
    const {error, value} = validateUser(body);
    if (error) {
        res.status(400).json({status: "fail", data: error.details});
        return;
    }
    // const user = await User.findOne({where: {[Op.or]: {username: body.username, email: body.email}}});
    // if (user) {
    //     let error;
    //     if (user.username === body.username) {
    //         error = {
    //             "message": "username is in use",
    //             "path": [
    //                 "username"
    //             ],
    //             "type": "any.unique",
    //             "context": {
    //                 "label": "username",
    //                 "key": "username"
    //             }
    //         }
    //     } else {
    //         error = {
    //             "message": "email is in use",
    //             "path": [
    //                 "email"
    //             ],
    //             "type": "any.unique",
    //             "context": {
    //                 "label": "email",
    //                 "key": "email"
    //             }
    //         }
    //     }
    //     res.status(400).json({status: 'fail', data: error});
    //     return;
    // };
    try {
        const newUser = User.build(value);
        const salt = await genSalt(10);
        const hashedPassword = await hash(newUser.password, salt);
        newUser.password = hashedPassword;
        await newUser.save();
        const userToSend = {firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, username: newUser.username, profilePic: newUser.profilePic};
        res.status(201).json({status:'success', data: userToSend});
        return;
    } catch (e:unknown) {
        if (e instanceof UniqueConstraintError) {
            let {origin, instance, ...rem} = e.errors[0];
            rem.message = `${rem.path} is in use`;
            res.status(400).json({status: 'fail', data: rem});
            return;
        }
        res.send('Error caught of sequelize');
        return;
    }
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
    let user = await User.findOne({where: {[Op.or]: {username: body.username, email: body.username}}});
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
    const webToken = sign(jwtPayload, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
    });
    res.cookie("authToken", webToken, {httpOnly: true});
    res.status(200).send('login success')
    return;
});

export const getUser = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    console.log("running getUser");
    const user = (req as ICustomeRequest).user;
    // console.log(user instanceof User)
    // const posts = await user.getPosts();
    res.status(200).json({status: "success", data: {user}})
    return;
})

export const logout = tryCatch(async (req:Request, res:Response, next:NextFunction) => {
    res.clearCookie('authToken');
    res.status(200).send("logout success");
    return;
});

export const changeUserPassword = tryCatch(async (req:Request, res:Response) => {
    const {prevPassword, newPassword} = req.body;
    const {error, value} = userPasswordChangeValidation(req.body);
    if (error) {
        res.status(400).json({status: 'fail', data: {error}});
        return;
    };
    const user = (req as ICustomeRequest).user;
    console.log(user.password);
    const dbUser = await User.findOne({where: {userId: user.userId}});
    if (!dbUser) {
        res.status(404).json({message: 'user not found'})
        return;
    }
    const isMatch = await dbUser.validatePassword(prevPassword, dbUser.password);
    if (!isMatch) {
        const err = {
            "message": "invalid password",
            "path": [
                "invalid"
            ],
            "type": "any.invalid",
            "context": {
                "label": "invalid",
                "key": "invalid"
            }
        } 
        res.status(400).json({status: 'fail', data: {error: err} });
        return;
    };
    dbUser.password = await User.hashPassword(newPassword);
    dbUser.save();
    res.status(200).json({status: 'success', data: dbUser});
    return;
});

export const sendToken = tryCatch(async (req: Request, res:Response) => {
    let {email} = req.body;
    if (!email) {
        let error = createValidationErr("email is required", "email")
        res.status(400).json({status: "fail", data: error});
        return;
    };
    const user = await User.findOne({where: {email: email}});
    if (!user) {
        res.status(404).json({status: 'fail', data: {message: "user not found"}});
        return;
    };
    const resetToken = await user.createResetToken();
    const resetURL = `${req.protocol}://${req.get('host')}/api/user/reset-password/${resetToken}`;
    const mailSent = await sendMail({text: 'Click this url for next step', html:`<a href="#">${resetURL}</a>`}, 'Password reset request', user.email);
    if (!mailSent) {
        res.status(500).send('something went wrong');
        return;
    }
    res.status(200).json({status: 'success', data: {message: 'Please check your email for next step'}});
    return;
})

export const resetPassword = tryCatch(async (req:Request, res:Response) => {
    const {token} = req.params;
    if (!token) {
        res.status(403).json({status: 'fail', data: {message: 'Request denied'}});
        return;
    };
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({where: {resetToken: hashedToken}});
    console.log(user);
    if (!user) {
        res.status(400).json({status: 'fail', data: {message: "Invalid token"}});
        return;
    };
    if (user.resetTokenExpires && user.resetTokenExpires <= Date.now()) {
        user.resetToken = null;
        user.resetTokenExpires = null;
        res.status(400).json({status: 'fail', data: {message: 'Token expired please try again'}});
        return;
    };
    const {newPassword, confPassword} = req.body;
    if (!newPassword || newPassword !== confPassword) {
        res.status(400).json({status: 'fail', data: {message: 'Please provide proper credentials'}});
        return;
    };
    const hashedPassword = await User.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    res.status(200).json({status: 'success', data: {message: "password reset successfully"}});
    return;
});
