import { IsEmail, Length } from "class-validator";
import { BeforeInsert, CreateDateColumn, Index, ManyToOne, UpdateDateColumn, JoinColumn } from "typeorm";
import { BaseEntity } from "typeorm";
import {Entity as TOEntity, PrimaryGeneratedColumn, Column} from "typeorm";
import bcrypt from 'bcrypt'
import { classToPlain, Exclude } from 'class-transformer'

import Entity from './Entity'
import User from "./User";
import { makeid, slugify } from "../util/helpers";
import Sub from "./Sub";

@TOEntity('posts')
export default class Post extends Entity {

    constructor(post: Partial<Post>){
        super()
        Object.assign(this, post)
    }
    
    @Index()
    @Column()
    identifier: string

    @Column()
    title: string

    @Index()
    @Column()
    slug: string

    @Column({ nullable: true, type: 'text' })
    body: string

    @Column()
    subName: string

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @ManyToOne(() => Sub, sub => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Sub;

    @BeforeInsert()
    makeIdAndSlog() {
        this.identifier = makeid(7)
        this.slug = slugify(this.title)
    }

}
