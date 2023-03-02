import {Request, Response, NextFunction, } from "express";

export type ControllerSign = (req:Request, res:Response, next:NextFunction) => Promise<void>;
