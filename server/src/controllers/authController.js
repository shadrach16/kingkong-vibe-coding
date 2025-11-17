import User from '../models/User.js';
import Billing from '../models/Billing.js';
import Plan from '../models/Plan.js';
import { sendEmail, createInAppNotification } from '../services/notificationService.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key'; 

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
       const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const newUser = new User({
      email,
      passwordHash: password,
      apiKey: uuidv4(),
    });
    
    await newUser.save();
    
    // Find the 'Free' plan to link the new user
    const freePlan = await Plan.findOne({ name: 'Free' });
    if (freePlan) {
      await new Billing({ userId: newUser._id, currentPlan: freePlan._id, usageCount: 0 }).save();
    }
    

    await sendEmail(email, 'Welcome!', 'Thank you for signing up!');
    res.status(201).json({ message: 'User created successfully. Please login.', apiKey: newUser.apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user.', error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const user = await User.findOne({ email });
    
     const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }



    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      apiKey: user.apiKey,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        apiKey: user.apiKey,
        subscriptionPlan: user.subscriptionPlan,
        usageCount: user.usageCount,
        dailyTaskLimit: user.dailyTaskLimit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

export { signup, login };