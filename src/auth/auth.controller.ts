import express, {Request, Response, NextFunction} from 'express';

const router = express.Router();
import {Body} from "../validators/body.validator";
import {SignUpDto} from "./dtos/sign-up.dto";
import {LoginDto} from "./dtos/login.dto";
import {signup, login} from './auth.service'


router.post('/sign-up', Body(SignUpDto), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signup(req.body);
        res.status(201).json({
            success: true,
            message: 'Signup successful',
        });
    } catch (error) {
        next(error);
    }
})

router.post('/login', Body(LoginDto), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result.user,
            authToken: result.token
        });
    } catch (error) {
        next(error);
    }
})


export const AuthController = router;