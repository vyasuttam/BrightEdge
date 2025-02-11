import multer from "multer";
import { storage } from "../config/multerConfig.js";

const filterCallback = (req, file, cb) => {

    const allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'video/mp4'];

    if (!allowed_types.includes(file.mimetype)) {
        return cb(new Error('file type not allowed'), false);
    }

    cb(null, true);
}

export const upload = multer({ 
    storage:storage,
    fileFilter:filterCallback
});

