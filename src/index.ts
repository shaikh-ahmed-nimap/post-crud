import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import syncTable from "./db";

(async (port) => {
    try {
        await syncTable({alter: true});
         app.listen(port, () => {
            console.log(`server port: ${port}`)
         })
    } catch (e) {
        throw e;
    }
})(5000);