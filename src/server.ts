import "reflect-metadata";
import {createConnection} from "typeorm";

import cors from 'cors';


import authRoutes from './routes/auth';

import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(cors())

app.get('/', (req, res) => res.send('Hello World'))
app.use('/api/auth', authRoutes)

app.listen(5000, async() => {
    console.log('Server Up at 5000')

    try{
        await createConnection()
        console.log("Database Connected")
    } catch(err) {
        console.log(err)
    }
})