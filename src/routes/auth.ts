import express, { Router } from 'express';
import { register } from '../controllers/auth';

const userRouter: Router = express.Router();

userRouter.post('/register', register);

export default userRouter;
