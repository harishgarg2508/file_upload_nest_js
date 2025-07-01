import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { dataSourceOptions } from './config/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UploadModule, TypeOrmModule.forRoot(dataSourceOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
