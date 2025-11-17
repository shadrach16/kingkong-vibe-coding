// server/src/controllers/internalFunctionController.js
import Project from '../models/Project.js';
import InternalFunctionModel from '../models/InternalFunction.js';

import * as internalFunctionService from '../services/internalFunctionService.js';
import { log } from '../services/loggingService.js';
import { runUserCode } from '../services/aiService.js';

const getInternalFunctions = async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({ message: 'projectId is required.' });
    }

    try {
        const functions = await internalFunctionService.getFunctions(projectId);
        res.status(200).json(functions);
    } catch (error) {
        log(projectId, 'error', 'Failed to get internal functions.', { errorMessage: error.message });
        res.status(500).json({ message: error.message || 'Failed to get internal functions.' });
    }
};

const createInternalFunction = async (req, res) => {
    const { projectId, name, prompt } = req.body;

    if (!projectId || !name || !prompt) {
        return res.status(400).json({ message: 'projectId, name, and prompt are required.' });
    }

    try {
        const newFunction = await internalFunctionService.createFunction(projectId, name, prompt);
        res.status(201).json(newFunction);
    } catch (error) {
        log(projectId, 'error', 'Failed to create internal function.', { errorMessage: error.message });
        res.status(500).json({ message: error.message || 'Failed to create internal function.' });
    }
};


const runInternalFunction = async (req, res) => {
  try {
    const { projectId, functionId } = req.params;
    const { params } = req.body;

    // Fetch the function details from the database
    const func = await InternalFunctionModel.findById(functionId);
    if (!func) {
      return res.status(404).json({ message: 'Function not found.' });
    }
    console.log(  params)

    // Run the code and capture the output
    const output = await runUserCode(projectId, func.code, func.libraries, params);

    res.status(200).json({ output });
  } catch (error) {
    console.error('Error running internal function:', error);
    res.status(500).json({ message:  error.message });
  }
}


const updateInternalFunction = async (req, res) => {
    const { id } = req.params;
    const { projectId } = req.body;
    const updates = req.body;

    if (!projectId || !updates) {
        return res.status(400).json({ message: 'projectId and updates are required.' });
    }

    try {
        const updatedFunction = await internalFunctionService.updateFunction(projectId, id, updates);
        res.status(200).json(updatedFunction);
    } catch (error) {
        log(projectId, 'error', 'Failed to update internal function.', { errorMessage: error.message });
        res.status(500).json({ message: error.message || 'Failed to update internal function.' });
    }
};


const  deleteInternalFunction =  async (req, res) => {
    try {
 const { id } = req.params;
    const { projectId } = req.query;
    console.log(projectId,id)

   if (!projectId ) {
        return res.status(400).json({ message: 'projectId is required.' });
    }

      // Find and delete the function, ensuring it belongs to the authenticated project
      const result = await InternalFunctionModel.findOneAndDelete({
        _id: id,
        projectId: projectId,
      });

      if (!result) {
        return res.status(404).json({ message: 'Function not found or you do not have permission to delete it.' });
      }

      res.status(200).json({ message: 'Function deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  }


export { getInternalFunctions, createInternalFunction, updateInternalFunction,deleteInternalFunction,runInternalFunction };