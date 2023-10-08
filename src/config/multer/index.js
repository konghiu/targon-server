import multer from "multer";
import { folderPublic } from "../../../index.js";

const createFileName = (originalname) => {
    const filename = new Date.now() + originalname;
    return filename;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${folderPublic}/images/`);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export default multer({ storage: storage });
