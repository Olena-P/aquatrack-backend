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
    gender: { type: String, default: 'female' },
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

export const UsersCollection = model('users', usersSchema);
