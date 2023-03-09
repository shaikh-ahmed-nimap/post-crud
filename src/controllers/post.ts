import {Request, Response} from "express";
import {tryCatch} from "../middlewares";
import Post from "../db/models/post"
import User from "../db/models/user"
import {ICustomeRequest} from "../middlewares/authenticate";
import {validatePost} from "../validators";
import upload from "../multer-config";

export const getPosts = tryCatch(async(req:Request, res:Response) => {
    const posts = await Post.findAndCountAll({include: {
        model: User,
        as: "owner",
        attributes: {exclude: ['password']}
    }});
        res.json({status: 'ok', data: posts});
        return;
});

export const createPost = tryCatch(async (req:Request, res:Response) => {
    const body = req.body;
    console.log("request.body", body);
    const user = (req as ICustomeRequest).user;
    
    const {error, value} = validatePost(body);
    if (error) {
        res.status(400).json({status: 'fail', data: {errors: error.details}});
        return;
    };
    const file = req.file;
    console.log("req.file", req.file);
    const post = Post.build(value);
    post.ownerId = user.userId;
    post.slug = (Date.now() + '-' + post.title.split(' ').join('-'));
    const filePath = file ? file.path.split('public')[1] : null;
    post.image = filePath;
    // await post.save();
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
    const user = (req as ICustomeRequest).user;
    const post = await Post.findOne({where: {slug}});
     if (!post) {
        res.status(400).json({status: "fail", data: "post not found"});
        return;
     };
     if (post.ownerId !== user.userId) {
        res.status(403).json({status: 'fail', data: "Permission denied"});
        return;
     }
     const {error, value} = validatePost(req.body);
     if (error) {
        res.status(400).json({status: 'fail', data: error});
        return;
     };
     post.title = value.title;
     post.description = value.description;
     post.slug = (Date.now() + '-' + post.title.split(' ').join('-'));
     post.image = value.image ? value.image : null;
     await post.save();
     res.status(200).json({status: "success", data: post});
    return;
});

export const deletePost = tryCatch(async (req:Request, res:Response) => {
    const {slug} = req.params;
    const user = (req as ICustomeRequest).user;
    const post = await Post.findOne({where: {slug}});;
    if (!post) {
        res.status(404).json({status: "fail", data: "post not found"});
        return;
    }
    // Post.PostData = Post.PostData.filter((post:IPost) => post.slug !== slug);
    if (user.userId !== post.ownerId) {
        res.status(403).json({status: 'fail', data: {'message': "Permission denied"}});
        return;
    }
    await post.destroy();
    res.status(200).json({status: "success", data: post});
    return;
});

export const getUserPost = tryCatch(async (req:Request, res:Response) => {
    const {username} = req.params;
    const result = await Post.findAndCountAll({include: {
        model: User,
        as: "owner",
        attributes: ['userId', 'username'],
        where: {
            username,
        }
    }});
    res.status(200).json({status: 'succes', data: result.rows, count: result.count})
});