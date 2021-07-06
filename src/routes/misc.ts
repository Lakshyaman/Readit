import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";
import Vote from "../entities/Vote";
import auth from "../middleware/auth";

const vote = async (req: Request, res: Response) => {
    const { identifier, slug, commonIdentifier, value } = req.body

    //Validate vote value
    if(![-1,0,-1].includes(value)){
        return res.status(400).json({ value: 'Value must be -1,0,1' })
    }

    try {
        const user: User = res.locals.user
        let post = await Post.findOneOrFail({ identifier, slug })

        let vote: Vote | undefined
        let comment: Comment | undefined

        if(commonIdentifier){
            //If there is a comment identifier then vote by comment
            comment = await Comment.findOneOrFail({ identifier: commonIdentifier })
            vote = await Vote.findOne({ user, comment })
        } else{
            //Else find vote by post
            vote = await Vote.findOne({ user, post })
        }
        if(!vote && value === 0){
            // if no vote and value == 0 return error
            return res.status(404).json({ error: 'Vote not found' })
        } else if(!vote){
            vote = new Vote({ user, value })
            if(comment)vote.comment = comment
            else vote.post = post
            await vote.save()
        } else if(value === 0){
            //If vote exists and value === 0 remove vote from db
            await vote.remove()
        } else if(vote.value != value){
            //If vote and value has changed , update vote
            vote.value = value
            vote.save()
        }

        post = await Post.findOneOrFail({ identifier, slug }, {relations: ['comments', 'sub', 'vote']})

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }

}

const router = Router()
router.post('./vote', auth, vote)


export default router