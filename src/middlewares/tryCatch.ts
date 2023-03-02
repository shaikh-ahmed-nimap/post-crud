import {Request, Response, NextFunction} from "express";
import {ControllerSign} from "../types/controller"

const tryCatch = (controller: ControllerSign) => async (req:Request, res:Response, next:NextFunction) => {
    try {
        await controller(req, res, next);
    } catch (err) {
        console.log(err);
        res.status(500).json('something went wrong');
    }
}

export default tryCatch;