// server/src/controllers/projectController.js

import Project from '../models/Project.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const apiKey = uuidv4();

    const newProject = new Project({
      name,
      userId,
      apiKey,
    });

    await newProject.save();

    user.projectIds.push(newProject._id);
    await user.save();

    res.status(201).json({
      message: 'Project created successfully.',
      project: {
        _id: newProject._id,
        name: newProject.name,
        apiKey: newProject.apiKey,
        createdAt: newProject.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project.', error: error.message });
  }
};

// @desc    Fetch all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Projects fetched successfully.',
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects.', error: error.message });
  }
};

export { createProject, getProjects };