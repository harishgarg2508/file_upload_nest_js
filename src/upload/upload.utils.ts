import { BadRequestException } from "@nestjs/common";
import { UploadApiResponse, v2 } from "cloudinary";
import { Request } from "express";

export const filenameEditor = (req: Request, file: Express.Multer.File, callback: (error: any, fileName: string) => void) => {
    const newfileName =  file.originalname;
    callback(null, newfileName);
}

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: (error: any, valid: boolean) => void) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|mp4)$/)) {
        return callback(
            new BadRequestException(`file must be of types jpg|jpeg|png`),
            false
        );
    }
    callback(null, true);
}

export async function   handleLocalUpload(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        const entity = this.uploadRepo.create({
            imageName: file.filename,
            URL: file.path
        });
        await this.uploadRepo.save(entity);
        return { message: 'File uploaded locally', path: file.path, db: entity };
    }

export async function handleCloudUpload(file: Express.Multer.File): Promise<UploadApiResponse> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return new Promise(async (resolve, reject) => {
            v2.uploader.upload(file.path, { folder: 'images' }, async (error, result) => {
                if (result) {
                    const entity = this.uploadRepo.create({
                        imageName: file.filename,
                        URL: result.secure_url
                    });
                    await this.uploadRepo.save(entity);
                    return resolve(result);
                }
                return reject(new Error("Upload failed "));
            });
        });
    }