import { Request, Response, Router } from "express";
import { User } from "../entities/User";






const register = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method == 'OPTIONS') {
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    }
    const {email, username, password} = req.body

    try{
        //Validate Data

        //Create the user
        const user = new User({ email, username, password })
        //return the user
        return res.json(user)
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


const router = Router()

router.post('/register', register)

export default router