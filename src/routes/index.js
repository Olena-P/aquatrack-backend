import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/water', waterRouter);

export default rootRouter;
