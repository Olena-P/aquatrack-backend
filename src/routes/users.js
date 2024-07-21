import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
  updateUserProfileSchema,
} from '../validation/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserController,
  loginUserController,
  refreshTokenUserSessionController,
  logoutUserController,
  requestResetEmailController,
  resetPasswordController,
  loginWithGoogleController,
  getUserProfileController,
  updateUserProfileController,
  getUsersTotalController,
} from '../controllers/users.js';
import { getGoogleOAuthUrlController } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

usersRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

usersRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

usersRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

usersRouter.post('/logout', ctrlWrapper(logoutUserController));

usersRouter.get('/user-profile', ctrlWrapper(getUserProfileController));

usersRouter.patch(
  '/user-profile',
  validateBody(updateUserProfileSchema),
  ctrlWrapper(updateUserProfileController),
);

usersRouter.post(
  '/refresh-token',
  ctrlWrapper(refreshTokenUserSessionController),
);

usersRouter.post(
  '/request-reset-pwd',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

usersRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

usersRouter.get('/total-users', ctrlWrapper(getUsersTotalController));

export default usersRouter;
