import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { isEmpty, validate } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import auth from '../middleware/auth'


const register = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method == 'OPTIONS') {
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    }
    const {email, username, password} = req.body

    try{
        //Validate Data
        let errorss: any = {}
        const emailUser = await User.findOne({ email })
        const usernameUser = await User.findOne({ username })

        if(emailUser) errorss.email = 'Email is already taken'
        if(usernameUser) errorss.username = 'Username is already taken'

        if(Object.keys(errorss).length > 0){
            return res.status(400).json(errorss)
        }
        //Create the user
        const user = new User({ email, username, password })
        const errors = await validate(user)
        if(errors.length > 0)return res.status(400).json({errors})
        await user.save()


        //return the user
        return res.json(user)
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    try{
        let errors: any = {}

        if(isEmpty(username)) errors.username = 'Username cannot be empty'
        if(isEmpty(password)) errors.password = 'Password cannot be empty'

        if(Object.keys(errors).length > 0){
            return res.status(400).json(errors)
        }
        const user = await User.findOne({ username })
        if(!user) return res.status(404).json({error: 'User not found'})

        const passwordMatches = await bcrypt.compare(password, user.password)

        if(!passwordMatches) return res.status(401).json({ password: 'Password is incorrect'})

        const token = jwt.sign({ username }, process.env.JWT_SECRET)

        res.set('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true, //stop javascript thus more secure
            secure: process.env.NODE_ENV === 'production', //ssl certificates needed to make it https
            sameSite: 'strict', //to make it to this site only
            maxAge: 3600,
            path: '/'
        }))

        return res.json(user)
    } catch(err) {

    }
}

const me = (_: Request, res: Response) => {
    return res.json(res.locals.user)
}

const logout = (_: Request, res: Response) => {
    res.set('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true, //stop javascript thus more secure
            secure: process.env.NODE_ENV === 'production', //ssl certificates needed to make it https
            sameSite: 'strict', //to make it to this site only
            expires: new Date(0),
            path: '/'
    }))
    return res.status(200).json({ success: true })
}




const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, me)
router.get('/logout', auth, logout)

export default router