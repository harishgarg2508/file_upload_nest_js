import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')
export class UploadEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    imageName:string;

    @Column()
    URL:string
}
