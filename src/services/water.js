import { WaterVolume } from '../db/models/water.js';

export const localDate = () => {
  const milliseconds = Date.now();
  const date = new Date(milliseconds);

  return date.toLocaleDateString();
};

export const localTime = () => {
  const milliseconds = Date.now();
  const time = new Date(milliseconds);

  const timeString = time.toLocaleTimeString();
  const parts = timeString.split(":");
  parts.pop();

  return parts.join(":");
};

export const createWaterVolume = async (payload, userId) => {
  const water = { ...payload, userId };
  return await WaterVolume.create(water);
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

export const getWaterVolumePerDay = async (year, month, day, userId) => {
  const query = {
    userId,
    date: `${day}.${month}.${year}`,
  };
  const water = await WaterVolume.find(query);
  return water;
};

export const getWaterVolumePerMonth = async (year, month, userId) => {
  const query = {
    userId,
    date: { $regex: `${month}.${year}` },
  };
  const water = await WaterVolume.find(query);
  const totalSumByDay = Array(32).fill(0);
  water.forEach((obj) => {
    const day = parseInt(obj.date.split(".")[0]);
    totalSumByDay[day] += obj.value;
  });
  return totalSumByDay;
};
