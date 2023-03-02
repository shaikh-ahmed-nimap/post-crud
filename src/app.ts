import express, {Request, Response} from 'express';
const app = express();

import {postRouter} from "./routes";
app.use(express.json());
app.use('/api/posts', postRouter)

app.get('/', (req:Request, res:Response) => {
    res.setHeader('content-type', 'text/html')
    res.send("<h1>hello world!!</h1>");
});

module.exports = app;