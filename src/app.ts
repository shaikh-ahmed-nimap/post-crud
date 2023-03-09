import express, {Request, Response} from 'express';
import cookieParser from "cookie-parser";
const app = express();
import path from "path";

import {postRouter, userRouter} from "./routes";
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);


app.get('/', (req:Request, res:Response) => {
    res.setHeader('content-type', 'text/html')
    res.send("<h1>hello world!!</h1>");
});

export default app;