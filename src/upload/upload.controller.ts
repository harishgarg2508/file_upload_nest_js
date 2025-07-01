import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('multer')
    @UseInterceptors(FileInterceptor('file', UploadService.multerOptions()))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.handleLocalUpload(file);
    }

    @Post('cloud')
    @UseInterceptors(FileInterceptor('image', UploadService.multerOptions()))
    async uploadCloudinary(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.handleCloudUpload(file);
    }
}