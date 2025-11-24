import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Billing from '../models/Billing.js';
import Plan from '../models/Plan.js';

const getUserProfile = (req, res) => {
  const { email, projectIds } = req.user;
  res.status(200).json({ email, projectIds });
};



const generateNewApiKey = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Find the user by ID and generate a new UUID for the API key
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.apiKey = uuidv4();
    await user.save();

    res.status(200).json({
      message: 'API key regenerated successfully.',
      apiKey: user.apiKey,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to regenerate API key.',
      error: error.message
    });
  }
};



const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's projects
    const projects = await Project.find({ userId });

    // Fetch user's billing information and current plan
    const billingInfo = await Billing.findOne({ userId }).populate('currentPlan');

    res.status(200).json({
      projects,
      billingInfo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data.', error: error.message });
  }
};


export { getUserProfile, generateNewApiKey,getDashboardData };