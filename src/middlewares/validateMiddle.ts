import {Request, Response, NextFunction} from "express";
import upload from "../multer-config";
import {ValidationError} from "joi";
import {MulterError} from "multer"


const validateMiddle = async (req:Request, res:Response, next: NextFunction) => {
    upload.single('image')(req, res, (err:unknown) => {
        if (err && err instanceof ValidationError) {
            res.status(500).send(err.details);
        } else if (err instanceof Error) {
            console.log(err);
            res.status(400).json({message: err.message, name: err.name})
        } else {
            next();
        }
    });
};

export default validateMiddle;