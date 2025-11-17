// user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    projectIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'vip'],
      default: 'free',
    },
    dailyTaskLimit: {
      type: Number,
      default: 1000, // Default for 'free' plan
    },
     subscriptionStatus: {
    type: String,
    enum: ['active', 'past_due', 'canceled', 'unpaid'],
    default: 'active'
  },
  lastPaymentDate: Date,
  nextPaymentDate: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;