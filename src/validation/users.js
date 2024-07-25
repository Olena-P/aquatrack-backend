import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(4).max(32),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const updateUserProfileSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  weight: Joi.number().optional(),
  activityLevel: Joi.number().integer().min(1).max(5).optional(),
  gender: Joi.string().valid('male', 'female').optional(),
  dailyRequirement: Joi.number().integer().min(200).max(5000),
  // photo: Joi.string().uri().optional(),
});
