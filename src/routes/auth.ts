import express, { Router } from 'express';
import { login, register } from '../controllers/auth';

const userRouter: Router = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

export default userRouter;
