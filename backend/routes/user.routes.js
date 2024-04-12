import { Router } from "express";
import zod from "zod"
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
import authMiddleware from "../middleware/middleware.js";
const router = Router();

const newSignUpUser = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})

const signup = async (req, res, next) => {
    const {success} = newSignUpUser.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const { username, firstName,lastName, password } = req.body;
    const validUser = await User.findOne({ username });
    if (validUser) {
        return res.status(400).json({ error: "Username is already exist" });
    }

    const newUser = await User.create({
        username,
        password,
        firstName,
        lastName
    });

    const userId = newUser._id;
    await newUser.save();

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

}

const newSignInUser = zod.object({
    username:zod.string().email(),
    password:zod.string(),
})

const signin = async (req,res,next)=>{
    const {success} = newSignInUser.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const {username, password} = req.body;
    const validUser = await User.findOne({username});
    const validPassword = (validUser.password === password) 
    if(!validUser || !validPassword){
        return res.status(401).json({message:"Error while logging in!"})
    }

    const token = jwt.sign({
        userId:validUser._id
    },process.env.JWT_SECRET);
    res.json({
        token: token
    })
}

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


router.post("/signup",signup);
router.post("/signin",signin);

export default router;