import Joi from 'joi';

export const createWaterVolumeSchema = Joi.object({
    volume: Joi.string().min(50).max(500).required(),
});

export const updateWaterVolumeSchema = Joi.object({
    volume: Joi.string().min(50).max(500),
});
