import { WaterVolume } from '../db/models/water.js';

export const createWaterVolume = async (payload) => {
  const water = await WaterVolume.create(payload);
  return water;
};

export const updateWaterVolume = async (
  waterId,
  payload,
  userId,
  options = {},
) => {
  const rawResult = await WaterVolume.findOneAndUpdate(
    { _id: waterId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  return {
    water: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteWaterVolume = async (waterId) => {
  const water = await WaterVolume.findOneAndDelete({
    _id: waterId,
  });
  return water;
};
