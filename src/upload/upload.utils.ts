import { BadRequestException } from "@nestjs/common";
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