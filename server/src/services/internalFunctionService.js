// server/src/services/internalFunctionService.js

import InternalFunctionModel from '../models/InternalFunction.js';
import { generateFunctionDetails,installUserModules } from './aiService.js';
import { log } from '../services/loggingService.js';

 

 


const getFunctions = async (projectId) => {
    try {
        const functions = await InternalFunctionModel.find({
            $or: [
                { projectId: projectId },
                { projectId: { $exists: false } }
            ]
        }).lean();
        return functions;
    } catch (error) {
        log(projectId, 'error', 'Failed to retrieve internal functions.', { errorMessage: error.message });
        throw new Error('Failed to retrieve internal functions.');
    }
};

const createFunction = async (projectId, name, prompt) => {
    try {
        // Generate the function code, docs, and libraries using the AI
        const { code, documentation, libraries,exampleUsage } = await generateFunctionDetails(prompt);

        if (libraries.length){
        // Call the functions in sequence
        installUserModules(projectId, libraries).then(e => {
          console.log(String(e))
        }).catch(err=>{
             throw new Error(String(err.message) )
        }) 

        }
       
        const newFunction = new InternalFunctionModel({
            name: name.startsWith("!") ? name: ('!'+name)  ,
            projectId,
            code,
            docs:documentation,
            libraries,
            exampleUsage
        });



        await newFunction.save();
        log(projectId, 'info', 'Internal function created successfully.', { functionName: name });
        return newFunction;
    } catch (error) {
        log(projectId, 'error', 'Failed to create internal function.', { functionName: name, errorMessage: error.message });
        throw new Error('Failed to create internal function.'+String(error.message ));
    }
};

const updateFunction = async (projectId, id, updates) => {
    try {
        const updatedFunction = await InternalFunctionModel.findOneAndUpdate(
            { _id: id, projectId }, // Ensure the function belongs to the project
            updates,
            { new: true, runValidators: true }
        ).lean();

        if (!updatedFunction) {
            throw new Error('Internal function not found or not editable.');
        }

        log(projectId, 'info', 'Internal function updated successfully.', { functionId: id });
        return updatedFunction;
    } catch (error) {
        log(projectId, 'error', 'Failed to update internal function.', { functionId: id, errorMessage: error.message });
        throw new Error('Failed to update internal function.');
    }
};

export { getFunctions, createFunction, updateFunction };