import multer from "multer"
import fs from "fs"
const storage = multer.diskStorage({
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random())+'-'+ crypto.randomUUID().toString()
        callback(null , uniqueSuffix+"-"+file.fieldname+'-'+file.originalname)
    },
    destination: (req, file, cb) => {
        const directory_name = "product_images"
        if (!fs.existsSync(directory_name)) {
            fs.mkdirSync(directory_name, { recursive: true });
        }
        cb(null, directory_name);
    },
})

export const uploadProduct = multer({storage})