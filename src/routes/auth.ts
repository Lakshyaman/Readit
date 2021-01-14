import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { validate } from 'class-validator'
import bcrypt from 'bcrypt'





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
        const user = await User.findOne({ username })
        if(!user) return res.status(404).json({error: 'User not found'})

        const passwordMatches = await bcrypt.compare(password, user.password)

        if(!passwordMatches) return res.status(401).json({ password: 'Password is incorrect'})

        return res.json(user)
    } catch(err) {

    }
}



const router = Router()

router.post('/register', register)
router.post('/login', login)

export default router