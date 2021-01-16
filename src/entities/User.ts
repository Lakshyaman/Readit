import { IsEmail, Length } from "class-validator";
import { BeforeInsert, Index, OneToMany } from "typeorm";
import {Entity as TOEntity, Column} from "typeorm";
import bcrypt from 'bcrypt'
import { classToPlain, Exclude } from 'class-transformer'

import Entity from './Entity'
import Post from "./Post";

@TOEntity('users')
export default class User extends Entity {

    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Index()
    @Length(3, 255, { message: 'Username must be at least 3 characters' })
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(3, 255)
    password: string

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }

}
