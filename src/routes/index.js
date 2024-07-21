import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';

const rootRouter = Router();

rootRouter.use('/user', authRouter);
rootRouter.use('/water', waterRouter);

export default rootRouter;
