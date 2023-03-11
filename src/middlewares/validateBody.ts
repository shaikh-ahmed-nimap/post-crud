import { Request, Response, NextFunction } from "express";
import { validatePost } from "../validators";
const validateBody = async (req:Request, res:Response, next:NextFunction) => {
    console.log('running validate body')
    console.log(req.body);
    next()
};

export default validateBody;