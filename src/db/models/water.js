import { model, Schema } from 'mongoose';
import { localDate, localTime } from '../../services/water.js';

const waterSchema = new Schema(
  {
    volume: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    date: {
      type: String,
      default: () => localDate(),
    },
    time: {
      type: String,
      default: () => localTime(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const WaterVolume = model('water', waterSchema);
