import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import { Request } from "express";
import { reqUser } from "../types/dataTypes/User";
import FilesServis from "../services/FilesServis";

const storageConfig = multer.diskStorage({
  destination: (req: Request & reqUser, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void): void => {
    const finalDir = FilesServis.generatePath(process.env.USERDATADIR, req.user.id, req.body.id);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    callback(null, finalDir);
  },
  filename: (req: Request & reqUser, file, callback: (error: Error | null, filename: string) => void): void => {
    const dir = FilesServis.generatePath(process.env.USERDATADIR, req.user.id, req.body.id);
    const files = FilesServis.getFilesList(dir).map((file) => file.split(".")[0]);
    for (let index = 0; index < parseInt(process.env.ACCESSABLE_LIMIT_IMAGES); index++) {
      if (!files.includes(index.toString())) {
        callback(null, index + "." + file.originalname.split(".")[1]);
        break;
      }
    }
  },
});

const fileFilter = (req: Request & reqUser, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export default multer({ storage: storageConfig, fileFilter: fileFilter });
