import { Injectable, BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { UploadApiResponse, v2 } from "cloudinary";
import { filenameEditor, imageFileFilter } from "./upload.utils";

const UPLOAD_DIR = './upload/files';

@Injectable()
export class UploadService {
    constructor() {
        v2.config({
            cloud_name: "dciagwfox",
            api_key: '677652416372896',
            api_secret: 'SQBd2nuAeBhGE_zACLgMnfPpmXA',
        });
    }

    static multerOptions() {
        return {
            storage: diskStorage({
          filename: filenameEditor,
          destination: UPLOAD_DIR,
            }),
            fileFilter: imageFileFilter,
            limits: { fileSize: 1000 * 1000 * 1 }
        };
    }
    async handleLocalUpload(file: Express.Multer.File) {
        if (!file ) {
            throw new BadRequestException('No file uploaded');
        }
        return { message: 'File uploaded locally', path: file.path };
    }
    async handleCloudUpload(file: Express.Multer.File): Promise<UploadApiResponse> {
        if (!file) {
            throw new BadRequestException('No file uploaded ');
        }
        return new Promise((resolve, reject) => {
            v2.uploader.upload(file.path, { folder: 'images' }, (error, result) => {
                if (result) return resolve(result);
                return reject(new Error("Upload failed "));
            });
        });
    }
}