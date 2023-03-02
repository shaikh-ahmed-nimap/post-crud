import {Router} from "express";
import {getPosts, createPost, getSinglePost, updatePost, deletePost} from "../controllers/post";

const router = Router();

router.route('/').get(getPosts).post(createPost);
router.route('/:slug').get(getSinglePost).put(updatePost).delete(deletePost);

export default router;