import {
    createWaterVolume,
    deleteWaterVolume,
    updateWaterVolume,
  } from '../services/water.js';
  import createHttpError from 'http-errors';

  export const createWaterController = async (req, res) => {
    const userId = req.user._id;
    const water = await createWaterVolume(req.body, userId);

    res.status(201).json({
      status: 201,
      message:
        'Data on the volume of water consumed has been successfully created!',
      data: water,
    });
  };

  export const upsertWaterVolumeController = async (req, res, next) => {
    const userId = req.user._id;
    const { waterId } = req.params;

    const result = await updateWaterVolume(waterId, req.body, userId, {
      upsert: true,
    });

    if (!result) {
      next(createHttpError(404, 'Water volume not found'));
      return;
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Successfully upserted water volume!',
      data: result.water,
    });
  };

  export const deleteWaterController = async (req, res, next) => {
    const userId = req.user._id;
    const { waterId } = req.params;

    const water = deleteWaterVolume(waterId, userId);

    if (!water) {
      next(createHttpError(404, 'Water volume not found!'));
      return;
    }

    res.status(204).send();
  };
