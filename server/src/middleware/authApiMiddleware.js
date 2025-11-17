// server/src/middleware/authApiMiddleware.js

import User from '../models/User.js';

const apiProtect = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const { projectId } = req.body;

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required in the request body.' });
  }

  try {
    // Find the user by the provided API key
    const user = await User.findOne({ apiKey });

    // Check if a user with that API key exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid API key.' });
    }

    if (!user.projectIds.includes(projectId)) {
      return res.status(403).json({ message: 'Access denied. The API key does not have access to this project.' });
    }

    // Attach the user object to the request for subsequent middleware/controllers
    req.user = user;
    next();
  } catch (error) {
    console.error('API key authentication failed:', error);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

export default apiProtect;