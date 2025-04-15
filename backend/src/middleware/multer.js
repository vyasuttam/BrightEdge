import multer from "multer";
import { storage } from "../config/multerConfig.js";

const filterCallback = (req, file, cb) => {

    const allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'video', 'pdf', 'docx', 'doc', 'pptx', 'ppt'];

    console.log(file.mimetype);

    if(file.mimetype.includes('video')) {
        file.mimetype = "video";
    }

    if (!allowed_types.includes(file.mimetype)) {
        return cb(new Error('file type not allowed'), false);
    }

    cb(null, true);
}

export const upload = multer({ 
    storage:storage,
    fileFilter:filterCallback,
    limits: {
        fileSize: 1000 * 1024 * 1024 * 1024, // 100MB max file size
        fieldSize: 1000 * 1024 * 1024, // 10MB max field size
        fields: 20, // Max number of fields
        files: 10, // Max number of files
      },
});

