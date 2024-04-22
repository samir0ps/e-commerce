import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import { getDirectory } from './setDirectory';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directory_name = getDirectory()
        if (!fs.existsSync(directory_name)) {
            fs.mkdirSync(directory_name, { recursive: true });
        }
        cb(null, directory_name);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random()) + crypto.randomUUID().toString();
        callback(null, uniqueSuffix + "_" + file.fieldname+"_" + file.originalname);
    },
});

export const upload = multer({ storage });
