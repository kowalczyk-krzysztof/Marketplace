import express, { Router } from 'express';
import { getMe, login, register } from '../controllers/auth';
import { protect } from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/me', protect, getMe);

export default userRouter;
