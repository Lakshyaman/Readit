import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "typeorm";
import { PrimaryGeneratedColumn, Column} from "typeorm";
import { classToPlain, Exclude } from 'class-transformer'


export default abstract class Entity extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number


    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    toJSON() {
        return classToPlain(this)
    }

}
