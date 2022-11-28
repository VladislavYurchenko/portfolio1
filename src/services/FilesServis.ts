import fs, { readdirSync } from "fs";
import mime from "mime";
import { ImageData } from "../types/dataTypes/Link";
import path from "path";
class FilesServis {
  static generatePath(...args: string[]): string {
    return path.resolve(...args);
  }

  static getFilesList(path: string): string[] {
    if (fs.existsSync(path)) {
      return readdirSync(path);
    } else return [];
  }

  static getType(path: string): string {
    return mime.getType(path);
  }

  static getBase64string(path: string): string {
    const bitmap = fs.readFileSync(path);
    const data = Buffer.from(bitmap).toString("base64");
    return data;
  }

  static fileIssue(path: string): boolean {
    return fs.existsSync(path);
  }

  static genImageData(path: string, file: string): ImageData {
    return { name: file, source: this.getBase64string(path), type: this.getType(path) } as ImageData;
  }

  static deleteLinksImage(linkDir: string, filesToDelete: string[]): void {
    fs.readdir(linkDir, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        filesToDelete.forEach((filetodelete) => {
          if (files.includes(filetodelete)) {
            this.deleteFile(linkDir + "/" + filetodelete);
          }
        });
        this.cleanDir(linkDir);
      }
    });
  }

  static cleanDir(dir: string): void {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        if (!files.length) {
          fs.rmdirSync(dir);
        }
      }
    });
  }

  static deleteFile(filePath: string, recursive?: boolean): void {
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmdirSync(filePath, { recursive: recursive });
    } else if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  }
}

export default FilesServis;
