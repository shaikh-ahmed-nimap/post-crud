import dotenv from "dotenv";
dotenv.config();
import app from "./app";

((port) => {
    try {
         app.listen(port, () => {
            console.log(`server port: ${port}`)
         })
    } catch (e) {
        throw e;
    }
})(5000);