import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', UploadService.multerOptions()))
  async autoUpload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.autoUpload(file);
  }

  @Post('cloud')
  @UseInterceptors(FileInterceptor('file', UploadService.cloudOptions()))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file)

  }
}