import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UploadEntity } from 'src/upload/entities/upload.entity';

dotenv.config();

const rawDataSourceOptions = {
    type: process.env.DATABASE_TYPE as DataSourceOptions['type'],
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    entities: [UploadEntity],
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;