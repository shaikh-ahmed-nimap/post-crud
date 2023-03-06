import express, {Request, Response} from 'express';
import cookieParser from "cookie-parser";
const app = express();

import {postRouter, userRouter} from "./routes";
app.use(express.json());
app.use(cookieParser());
app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);


app.get('/', (req:Request, res:Response) => {
    res.setHeader('content-type', 'text/html')
    res.send("<h1>hello world!!</h1>");
});

export default app;