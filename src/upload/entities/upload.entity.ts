import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UploadEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    imageName:string;

    @Column()
    URL:string
}
