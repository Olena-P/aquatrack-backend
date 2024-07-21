import { Router } from 'express';
import authRouter from './users.js';
import waterRouter from './water.js';

const rootRouter = Router();

rootRouter.use('/users', authRouter);
rootRouter.use('/water', waterRouter);

export default rootRouter;
