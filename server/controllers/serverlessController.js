import { generateFunctionCode } from '../services/aiService.js';
import { deployFunction } from '../services/serverlessService.js';
import { sendEmail, createInAppNotification } from '../services/notificationService.js'; // New import
import User from '../models/User.js';



const createServerlessFunction = async (req, res) => {
  const { prompt, functionName, projectId } = req.body;

  if (!prompt || !functionName || !projectId) {
    return res.status(400).json({ message: 'Prompt, functionName, and projectId are required.' });
  }

  try {
    const functionCode = await generateFunctionCode(prompt);
    const newFunction = await deployFunction(req.user._id, projectId, functionName, functionCode);
    const user = await User.findById(req.user._id);

    // Send a notification about the new function
    await sendEmail(user.email, 'Serverless Function Deployed', `Your function '${functionName}' is now live at: ${newFunction.endpoint}`);
    await createInAppNotification(user._id, 'Function Deployed', `Your function '${functionName}' has been deployed.`);

    res.status(200).json({
      message: 'Serverless function created and deployed successfully.',
      function: newFunction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create serverless function.' });
  }
  
};

export { createServerlessFunction };