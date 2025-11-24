import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const signup = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const apiKey = uuidv4();
  const newUser = new User({
    email,
    passwordHash: password, // Mongoose pre-save hook will hash this
    apiKey,
  });

  await newUser.save();
  return { apiKey, userId: newUser._id, email: newUser.email };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  return { apiKey: user.apiKey, userId: user._id, email: user.email };
};

export { signup, login };