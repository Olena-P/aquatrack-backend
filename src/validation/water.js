import Joi from 'joi';

export const createWaterVolumeSchema = Joi.object({
    volume: Joi.number().min(50).max(500),
    date: Joi.string(),
});

export const updateWaterVolumeSchema = Joi.object({
    volume: Joi.number().min(50).max(500),
    data: Joi.string(),
});
