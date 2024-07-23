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
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';

export const registerUserController = async (req, res) => {
  const userId = req.user._id;
  const file = req.file;

  let fileUrl;

  if (file) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      fileUrl = await saveFileToCloudinary(file);
    } else {
      fileUrl = await saveFileToUploadDir(file);
    }

    const user = await registerUser({ ...req.body, photo: fileUrl, userId });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  }
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
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
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
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
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
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

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getUserProfileController = async (req, res, next) => {
  try {
    console.log('User in controller:', req.user);
    const userId = req.user.id;
    const userProfile = await getUserProfile(userId);

    res.status(200).json({
      status: 200,
      message: 'User profile retrieved successfully',
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedUserProfile = await updateUserProfile(userId, updateData);

    res.status(200).json({
      status: 200,
      message: 'User profile updated successfully',
      data: updatedUserProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersTotalController = async (req, res, next) => {
  const count = await getTotalUsers();
  res.status(200).json({ count });
};

export const patchUserController = async (req, res, next) => {
  const { userId } = req.params;
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
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a user!`,
    data: result.user,
  });
};
