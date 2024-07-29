import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    password: { type: String, required: true },
    weight: Number,
    activityLevel: Number,
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'female',
    },
    dailyRequirement: {
      type: Number,
      default: 2000,
    },
    photo: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

usersSchema.methods.calculateWaterIntake = function () {
  const { weight, activityLevel, gender } = this;
  let V;

  if (weight && activityLevel) {
    if (gender === 'female') {
      V = weight * 0.03 + activityLevel * 0.4;
    } else if (gender === 'male') {
      V = weight * 0.04 + activityLevel * 0.6;
    } else {
      V = 2000;
    }
  } else {
    V = 2000;
  }

  return V * 1000;
};

export const UsersCollection = model('users', usersSchema);
