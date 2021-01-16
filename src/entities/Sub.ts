import { IsEmail, Length } from "class-validator";
import { BeforeInsert, CreateDateColumn, Index, ManyToOne, UpdateDateColumn, JoinColumn, In, OneToMany } from "typeorm";
import { BaseEntity } from "typeorm";
import {Entity as TOEntity, PrimaryGeneratedColumn, Column} from "typeorm";
import bcrypt from 'bcrypt'
import { classToPlain, Exclude } from 'class-transformer'

import Entity from './Entity'
import User from "./User";
import { makeid, slugify } from "../util/helpers";
import { text } from "express";
import Post from "./Post";

@TOEntity('subs')
export default class Sub extends Entity {

    constructor(sub: Partial<Sub>){
        super()
        Object.assign(this, sub)
    }
    
    @Index()
    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ nullable: true })
    imageUrn: string
    
    @Column({ nullable: true })
    bannerUrn: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]
}
