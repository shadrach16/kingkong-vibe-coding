
import api from './api';

const createProject = async (projectName) => {
  try {
    const response = await api.post('/projects', { name: projectName });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const projectService = {
  createProject,
  getProjects,
};

export default projectService;