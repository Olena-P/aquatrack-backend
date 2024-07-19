import { model, Schema } from 'mongoose';

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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterVolume = model('water', waterSchema);
