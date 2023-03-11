import multer, { MulterError } from "multer";
import path from "node:path";
import fs from "node:fs"
import { ICustomeRequest } from "../middlewares/authenticate";

const allowedExtensions = ['.png', '.jpg', '.jpeg']

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const basePath = req.baseUrl.split('/')[2];
        let dest: string = '';
        if (basePath === 'user') {
            dest = path.resolve(__dirname, '../', 'public', 'images', 'profile-pic', (req as ICustomeRequest).user.username);
        } else if (basePath === 'posts') {
            dest = path.resolve(__dirname, '../', 'public', 'images', 'posts', (req as ICustomeRequest).user.username);
        }
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
            cb(null, dest);
        } else {
            cb(null, dest);
        }
    },
    filename: (req, file, cb) => {
        try {
            console.log('creating filename')
            // const extName = path.extname(file.originalname);
            let nameOfFile = Date.now() + '-' + file.originalname;
            cb(null, nameOfFile)
        } catch (e:unknown) {
            console.log("error in filename multer", e)
            if (e instanceof MulterError) {
                cb(e, 'Something went wrong');
                return;
            };
            throw e;
        }
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('running fileFilter')
        console.log(file.originalname);
        let extName = path.extname(file.originalname);
        if (!allowedExtensions.includes(extName)) {
            cb(null, false);
            return cb(new Error('Only .png, .jpg are allowed'));
        }
        cb(null, true);
    },
});

export default upload;