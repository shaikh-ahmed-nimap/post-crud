import {NextFunction, Request, Response} from "express";
import {tryCatch} from "../middlewares";
import { Post } from "../models";
import { IPost } from "../models/modelInterfaces";
import {validatePost} from "../validators";

export const getPosts = tryCatch(async(req:Request, res:Response) => {
        res.json({status: 'ok', data: Post.PostData});
        return;
});

export const createPost = tryCatch(async (req:Request, res:Response) => {
    const body:IPost = req.body;
    const {error, value} = validatePost(body)
    if (error) {
        res.status(400).send(error.details);
        return;
    }
    const post = new Post(value.title, value.description);
    // console.log(post);
    Post.PostData.push(post);
    res.status(201).json({status: 'ok', data: post});
    return;
});

export const getSinglePost = tryCatch(async (req: Request, res:Response) => {
    const {slug} = req.params;
    const post = Post.PostData.find((post) => slug === post.slug);
    if (!post) {
        res.status(404).json({status: 'fail', data: 'post not found'});
        return;
    }
    res.status(200).json({status: "success", data: post});
    return;
});

export const updatePost = tryCatch(async (req:Request, res:Response) => {
    const {slug} = req.params;
    const post = Post.PostData.find((post) => post.slug === slug);
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
    const post = Post.PostData.find((post:IPost) => post.slug === slug);
    if (!post) {
        res.status(404).json({status: "fail", data: "post not found"});
        return;
    }
    Post.PostData = Post.PostData.filter((post:IPost) => post.slug !== slug);
    res.status(200).json({status: "success", data: post});
    return;
});