import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { diskStorage } from "multer";
import { UploadApiResponse, v2 } from "cloudinary";
import { filenameEditor, handleCloudUpload, imageFileFilter } from "./upload.utils";
import { UploadEntity } from "./entities/upload.entity";
import * as fs from 'fs/promises';
import { handleLocalUpload } from "./upload.utils";
const UPLOAD_DIR = './upload/files';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(UploadEntity)
        private readonly uploadRepo: Repository<UploadEntity>
    ) {
        v2.config({
            cloud_name: "dciagwfox",
            api_key: '677652416372896',
            api_secret: 'SQBd2nuAeBhGE_zACLgMnfPpmXA',
        });
    }
 async autoUpload(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (file.size > 50* 1024*1024) {
            const cloudResult = await handleCloudUpload(file);
            await fs.unlink(file.path);
            return { message: 'File uploaded to cloud and local file deleted', cloud: cloudResult };
        } else {
            return handleLocalUpload(file);
        }
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

}

