import {Router} from "express";
import {getPosts, createPost, getSinglePost, updatePost, deletePost,getUserPost} from "../controllers/post";
import { authenticateUser } from "../middlewares";

const router = Router();

router.route('/').get(getPosts).post(authenticateUser, createPost);
router.route('/:slug').get(getSinglePost).put(authenticateUser,updatePost).delete(authenticateUser,deletePost);
router.route('/user/:username').get(getUserPost);

export default router;