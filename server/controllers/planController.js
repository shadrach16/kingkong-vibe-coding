import Plan from '../models/Plan.js';

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pricing plans.', error: error.message });
  }
};

export { getPlans };