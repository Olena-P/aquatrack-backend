import createHttpError from 'http-errors';

import {
  registerUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
  getUserProfile,
  updateUserProfile,
  getTotalUsers,
} from '../services/users.js';
import { ONE_DAY } from '../constants/index.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';

export const registerUserController = async (req, res) => {
  const { user, session } = await registerUser(req.body);
  setupSession(res, session);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      user,
      accessToken: session.accessToken,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { user, session } = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      user,
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    await logoutUser(sessionId, refreshToken);

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshTokenUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res, next) => {
  try {
    const session = await loginOrSignupWithGoogle(req.body.code);
    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in via Google OAuth!',
      data: {
        accessToken: session.accessToken,
      },
    });

    res.redirect('/tracker');
  } catch (error) {
    next(error);
  }
};

export const getUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProfile = await getUserProfile(userId);

    if (!userProfile) {
      return next(createHttpError(404, 'User not found'));
    }

    const dailyWaterIntake = userProfile.calculateWaterIntake();

    res.status(200).json({
      status: 200,
      message: 'User profile retrieved successfully',
      data: {
        ...userProfile.toJSON(),
        dailyWaterIntake,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const result = await updateUserProfile(userId, {
      ...updateData,
      photo: photoUrl,
    });

    if (!result) {
      return next(createHttpError(404, 'User not found'));
    }
    res.json({
      status: 200,
      message: 'Successfully patched a user!',
      data: result,
    });
  } catch {
    next(createHttpError(500, 'Internal Server Error'));
  }
};

export const getUsersTotalController = async (req, res, next) => {
  const count = await getTotalUsers();
  res.status(200).json({ count });
};
