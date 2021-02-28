import express, { Router } from 'express';
import { deleteUser, getMe, login, register } from '../controllers/auth';
import { authorize, protect } from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/me').get(protect, getMe);
userRouter.route('/users/:id').delete(protect, authorize('admin'), deleteUser);

export default userRouter;
