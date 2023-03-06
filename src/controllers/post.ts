import {NextFunction, Request, Response} from "express";
import {tryCatch} from "../middlewares";
import Post from "../db/models/post"
import User from "../db/models/user"
import { IPost } from "../models/modelInterfaces";
import {ICustomeRequest} from "../middlewares/authenticate";
import {validatePost} from "../validators";

export const getPosts = tryCatch(async(req:Request, res:Response) => {
    const posts = await Post.findAndCountAll({include: {
        model: User,
        attributes: {exclude: ['password']}
    }});
        res.json({status: 'ok', data: posts});
        return;
});

export const createPost = tryCatch(async (req:Request, res:Response) => {
    const body = req.body;
    const user = (req as ICustomeRequest).user;
    const {error, value} = validatePost(body)
    if (error) {
        res.status(400).send(error.details);
        return;
    }
    const post = Post.build(value);
    post.ownerId = user.userId;
    await post.save();
    res.status(201).json({status: 'ok', data: post});
    return;
});

export const getSinglePost = tryCatch(async (req: Request, res:Response) => {
    const {slug} = req.params;
    const post = await Post.findOne({where: {slug}});
    if (!post) {
        res.status(404).json({status: 'fail', data: 'post not found'});
        return;
    }
    res.status(200).json({status: "success", data: post});
    return;
});

export const updatePost = tryCatch(async (req:Request, res:Response) => {
    const {slug} = req.params;
    const post = await Post.findOne({where: {slug}});
     if (!post) {
        res.status(400).json({status: "fail", data: "post not found"});
        return;
     }
     const {error, value} = validatePost(req.body);
     if (error) {
        res.status(400).json({status: 'fail', data: error});
        return;
     };
     post.title = value.title;
     post.description = value.title;
     post.image = value.image ? value.image : null;
     res.status(200).json({status: "success", data: post});
    return;
});

export const deletePost = tryCatch(async (req:Request, res:Response) => {
    const {slug} = req.params;
    console.log(slug)
    const post = await Post.findOne({where: {slug}});;
    if (!post) {
        res.status(404).json({status: "fail", data: "post not found"});
        return;
    }
    // Post.PostData = Post.PostData.filter((post:IPost) => post.slug !== slug);
    res.status(200).json({status: "success", data: post});
    return;
});