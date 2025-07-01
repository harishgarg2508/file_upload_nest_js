import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { diskStorage } from "multer";
import { UploadApiResponse, v2 } from "cloudinary";
import { filenameEditor, imageFileFilter } from "./upload.utils";
import { UploadEntity } from "./entities/upload.entity";
import * as fs from 'fs/promises';
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

    if (file.size < 50 * 1024 * 1024) {
      const cloudResult = await this.handleCloudUpload(file);
      await fs.unlink(file.path);
      return { message: 'File uploaded to cloud and local file deleted', cloud: cloudResult };
    } else {
      return this.handleLocalUpload(file);
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



  async handleLocalUpload(file: Express.Multer.File) {
    if (!file|| file.size < 1 * 1024) {
      throw new BadRequestException('file not found or size is less than 1kb');
    }
    const entity = this.uploadRepo.create({
      imageName: file.filename,
      URL: file.path
    });
    await this.uploadRepo.save(entity);
    return { message: 'File uploaded locally', path: file.path, db: entity };
  }

  async handleCloudUpload(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let attempt = 0;
    const maxAttempt = 3;

    while (attempt < maxAttempt) {
      try {
        return await new Promise((resolve, reject) => {
          v2.uploader.upload(file.path, { folder: 'images' }, async (error, result) => {
            if (result) {
              const entity = this.uploadRepo.create({
                imageName: file.filename,
                URL: result.secure_url
              });
              await this.uploadRepo.save(entity);
              return resolve(result);
            }
            return reject(new Error("Upload failed"));
          });
        });
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempt) {
          throw error;
        }
      }
    }

    throw new Error("Upload failed ");
  }

}

