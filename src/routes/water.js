import { Router } from 'express';
import { createWaterController, deleteWaterController, upsertWaterVolumeController } from '../controllers/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createWaterVolumeSchema, updateWaterVolumeSchema } from '../validation/water.js';
import { validateBody } from '../middlewares/validateBody.js';
import { checkToken } from '../middlewares/checkToken.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(checkToken);

router.use(authenticate);

router.post('/', validateBody(createWaterVolumeSchema), ctrlWrapper(createWaterController));

router.put('/:waterId', validateBody(updateWaterVolumeSchema), ctrlWrapper(upsertWaterVolumeController));

router.delete('/:waterId', ctrlWrapper(deleteWaterController));

export default router;
