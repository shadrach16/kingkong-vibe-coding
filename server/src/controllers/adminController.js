import User from '../models/User.js';
import Billing from '../models/Billing.js';
import Plan from '../models/Plan.js';
import { v4 as uuidv4 } from 'uuid';

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('billing').select('-passwordHash -apiKey');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

const updateUserTaskLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { newLimit } = req.body;

    const billing = await Billing.findOneAndUpdate(
      { userId: id },
      { usageCount: newLimit },
      { new: true }
    );
    if (!billing) {
      return res.status(404).json({ message: 'Billing info not found.' });
    }

    res.status(200).json({ message: 'Task limit updated successfully.', billing });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task limit.' });
  }
};

const resetUserApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const newApiKey = uuidv4();
    const user = await User.findByIdAndUpdate(
      id,
      { apiKey: newApiKey },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'API key reset successfully.', newApiKey });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset API key.' });
  }
};

export {
  getAllUsers,
  updateUserTaskLimit,
  resetUserApiKey,
};