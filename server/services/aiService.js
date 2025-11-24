import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from '../config/env.js';
import { task_organiser, kingkong, function_generator_prompt } from '../utils/prompts.js'; // ⚠️ NEW IMPORT
import functions_args,{internal_functions as functionsCall} from '../utils/functions_declarations.js'
import mongoose from 'mongoose';
import SchemaModel from '../models/Schema.js'; 
import InternalFunctionModel from '../models/InternalFunction.js'; // ⚠️ NEW IMPORT

import { fileURLToPath } from 'url';
import { dirname, join, normalize, sep } from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

// ESM equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


function findNpmExecutable() {
  const isWin = process.platform === 'win32';
  const npmExec = isWin ? 'npm.cmd' : 'npm';
  const commonPaths = isWin
    ? [
        process.env.APPDATA ? join(process.env.APPDATA, 'npm') : null,
        process.env.ProgramFiles ? join(process.env.ProgramFiles, 'nodejs') : null,
        process.env.ProgramFiles ? join(process.env.ProgramFiles, 'Nodejs') : null,
        'C:\\Program Files\\nodejs',
      ]
    : [
        '/usr/local/bin',
        '/usr/bin',
      ];

  for (const dir of commonPaths) {
    if (dir) {
      const fullPath = join(dir, npmExec);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  }

  const pathDirs = process.env.PATH ? process.env.PATH.split(sep) : [];
  for (const dir of pathDirs) {
    const fullPath = join(dir, npmExec);
    if (fs.existsSync(fullPath)) {
          return fullPath;
    }
  }

  return npmExec;
}


async function installUserModules(userId='global', packages, npmPath = findNpmExecutable()) {
  if (!packages || packages.length === 0) {
    console.log(`No packages to install for user ${userId}.`);
    return;
  }
  
  const userDir = join(__dirname, 'user_modules', userId );

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  let command = npmPath;
  let args = ['install', ...packages, '--prefix', userDir];

  if (process.platform === 'win32') {
    command = 'cmd.exe';
    args = ['/c', npmPath, ...args];
  }

  return new Promise((resolve, reject) => {
    const npm = spawn(command, args, {
      cwd: userDir,
      stdio: 'inherit'
    });

    npm.on('close', (code) => {
      if (code === 0) {
        resolve(`Packages installed successfully for user ${userId}`);
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    npm.on('error', (err) => {
      reject(new Error(`Failed to start npm process. Please ensure npm is installed and in your system's PATH. Error: ${err.message}`));
    });
  });
}



async function runUserCode(userId='global', codeString, libraries, params = {}) {
  const userDir = join(__dirname, 'user_modules', userId);
  const userCodeFile = join(userDir, 'run.js');

  try {
    const packages = String(libraries).split(',').map(p => p.trim()).filter(p => p);
    // await installUserModules(userId, packages);
    
    const paramsJson = JSON.stringify(params);

    const modifiedCodeString = `
      let params = {};
      try {
        params = JSON.parse(process.argv[2] || '{}');
      } catch (e) {
        console.error('Error parsing params from command line:', e.message);
      }
      
      // User's code starts here
      ${codeString}
    `;

    fs.writeFileSync(userCodeFile, modifiedCodeString);

    return new Promise((resolve, reject) => {
      const child = spawn('node', [userCodeFile, paramsJson], {
        cwd: userDir,
        // Change stdio to 'pipe' to capture output
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_PATH: userDir 
        }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          // Resolve with the captured stdout
          resolve(stdout.trim());
        } else {
          // Reject with the captured stderr
          const errorMessage = stderr.trim() || `Child process exited with code ${code}`;
          reject(new Error(errorMessage));
        }
      });

      child.on('error', (err) => {
        reject(new Error(`Failed to start child process: ${err.message}`));
      });
    });

  } catch (error) {
    // Re-throw the error for the caller to handle
    throw new Error(`Error preparing user code: ${error.message}`);
  }
}


const substituteEnvVars = (prompt, envVars) => {
  let newPrompt = prompt;
  for (const name in envVars) {
    const regex = new RegExp(`\\$${name}`, 'g');
    newPrompt = newPrompt.replace(regex, envVars[name]);
  }
  return newPrompt;
};

const generateExecutionPlan = async (projectId, prompts, variables, attachment_variables) => {
  const project_data = {}
  project_data['projectId'] = projectId
  project_data['prompts'] = prompts
  project_data['variables'] = variables

   const { dynamicFunctionsArgs, dynamicFunctionsCall } = await getCustomInternalFunctions(projectId);

  project_data['internal_functions'] =  dynamicFunctionsCall
  project_data['schemas'] = getSchema(projectId)

  

  const systemPrompt = task_organiser(project_data) ;


  try {
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(systemPrompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    console.log(cleanJson)
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw new Error('Failed to generate a valid query plan from AI.');
  }
};


const getCustomInternalFunctions = async (projectId) => {
  try {
    const customFunctions = await InternalFunctionModel.find({
        $or: [
            { projectId: projectId },
            { projectId: { $exists: false } }
        ]
    }).lean();
    
    // Create the functions_args and functionsCall objects dynamically
    const dynamicFunctionsArgs = {};
    const dynamicFunctionsCall = [];

    customFunctions.forEach(fn => {
        dynamicFunctionsArgs[fn.name] = {
            libraries: fn.libraries,
            code: fn.code,
        };

        // Create a dynamic function from the stored code
        dynamicFunctionsCall.push(`Name:${fn.name}, \nDocumentaion:${fn.docs}` )
    });

    return { dynamicFunctionsArgs, dynamicFunctionsCall };
  } catch (error) {
    console.error("Failed to load custom internal functions:", error);
    return { dynamicFunctionsArgs: {}, dynamicFunctionsCall: {} };
  }
};




/**
 * Resolves a template string by replacing placeholders like {{results.2.name}}
 * with values from the provided data object.
 */
const resolveTemplate = (template, data) => {
  if (typeof template === 'string') {
    const placeholderRegex = /{{(.*?)}}/g;
    return template.replace(placeholderRegex, (match, expr) => {
      try {
        const parts = expr.split('.');
        let value = data;

        for (const part of parts) {
          // If the part is a number (e.g., '1'), use bracket notation
          if (!isNaN(parseInt(part, 10)) && isFinite(part)) {
            value = value[parseInt(part, 10)];
          } else {
            // Otherwise, use dot notation
            value = value[part];
          }
          if (value === undefined || value === null) {
            // Stop if any part of the path is not found
            value = undefined;
            break;
          }
        }

        if (value !== undefined) {
          // If the value is an object or array, stringify it
          return typeof value === 'object' ? JSON.stringify(value) : value;
        }

        // Return the original placeholder if no value is found
        return match;
      } catch (e) {
        console.error(`Failed to resolve template expression: ${expr}`, e);
        return match;
      }
    });
  } else if (Array.isArray(template)) {
    // Recursively process each element in an array
    return template.map(item => resolveTemplate(item, data));
  } else if (typeof template === 'object' && template !== null) {
    // Recursively process each property in an object
    const resolvedObject = {};
    for (const key in template) {
      if (Object.hasOwnProperty.call(template, key)) {
        resolvedObject[key] = resolveTemplate(template[key], data);
      }
    }
    return resolvedObject;
  }
  return template;
};

/**
 * Executes a given execution plan by running tasks sequentially.
 */
const executePlan = async (executionPlan, projectId,variables) => {

  if (!executionPlan || !Array.isArray(executionPlan) || executionPlan.length === 0) {
    return { error: 'Execution plan is required and must be a non-empty array.' };
  }

  if (!mongoose.connection || !mongoose.connection.db) {
    return { error: 'Database connection is not available.' };
  }

  const taskResults = {};
  const db = mongoose.connection.db;

  try {
    for (const task of executionPlan) {
      const { id, task_type, action, operation_type } = task;

      console.log(`Processing task ${id} (${task_type})...`);

      if (task_type === 'MONGOOSE_QUERY') {
        const { query, operation_type } = action;

        if (!query || typeof query !== 'string' || query.trim() === '') {
          throw new Error(`Task ${id}: Missing or invalid query string.`);
        }
        
        // Execute the query using eval() against the database connection
        let result = await eval(`(async () => {
          return await ${query};
        })()`);

        // Check if the query returns a cursor and convert it to an array
        // This handles find() operations which return a FindCursor object
        if (operation_type === 'READ' && result && typeof result.toArray === 'function') {
          result = await result.toArray();
        }

        taskResults[id] = result;
      } else if (task_type === 'DATA_MANIPULATION') {
        const { source, instruction } = action;

        if (  !instruction) {
          throw new Error(`Task ${id}: Missing 'instruction' in action.`);
        }

        let sourceData = {}

        // Resolve the source data using the results from previous tasks
        try {
        sourceData = eval(resolveTemplate(source, { results: taskResults }));
        console.log('sourceData',sourceData) 

        } catch (err) {
        ;
        }

        const systemPrompt = kingkong(sourceData, instruction,variables) ;

        try {
          const chat = model.startChat({ history: [] });
          const result = await chat.sendMessage(systemPrompt);
          const text = result.response.text();
          const cleanJson = text.replace(/```json|```/g, '').trim();
          taskResults[id] = JSON.parse(cleanJson);
        } catch (error) {
          console.error("Gemini AI error:", error);
          throw new Error('Failed to generate a valid query plan from AI.');
        }
      } else if (task_type === 'INTERNAL_FUNCTION_CALL') {
        const { function_name, params } = action;
         const { dynamicFunctionsArgs } = await getCustomInternalFunctions(projectId);
        const allFunctionsCall = dynamicFunctionsArgs;

        if (!function_name || !params) {
          throw new Error(`Task ${id}: Missing 'function_name' or 'params' in action.`);
        }

        // Find and execute the internal function
        const fn = allFunctionsCall[function_name];
        const result = await runUserCode(projectId, fn.code, fn.libraries, params)
        taskResults[id] = result;
      } else if (task_type === 'CLARIFICATION_REQUIRED') {
         
         taskResults[id] = action?.message;
      } else {
        console.warn(`Task ${id}: Unsupported task type '${task_type}'. Skipping.`);
      }
    }
  } catch (error) {
    // Return an error object if any task fails
    throw new Error(`Task failed at step '${error.message}'. ${error?.errorResponse?.errmsg}`);
    return;
  }

  return { results: taskResults };
};


const generateFunctionDetails = async (prompt,VARIABLES={}) => {
    try {
        const systemPrompt = function_generator_prompt(prompt,VARIABLES);
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage(systemPrompt);
        const text = result.response.text();
        const cleanJson = text.split("\n========\n") ;  
        return {
          documentation:String(cleanJson[1]).trim(),
          libraries:String(cleanJson[2]).trim().split(","),
          code:String(cleanJson[3]).trim(),
          exampleUsage:String(cleanJson[4]).trim(),
        };
    } catch (error) {
        console.error("Gemini AI function generation error:", error);
        throw new Error(error.message);
    }
};


const saveSchema = async (projectId, updatedSchemas) => {
  if (!updatedSchemas || Object.keys(updatedSchemas).length === 0) {
    console.log('No schemas to update.');
    return;
  }

  try {
    // Find and update the document, or create a new one if it doesn't exist
    const result = await SchemaModel.findOneAndUpdate(
      { projectId },
      { $set: { schemas: updatedSchemas } },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Schemas for projectId ${projectId} saved successfully.`, result);
    return result;
  } catch (error) {
    console.error(`Failed to save schemas for projectId ${projectId}:`, error);
    throw new Error('Failed to save project schemas.');
  }
};



const getSchema = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required to fetch schemas.');
  }

  try {
    const schemaDoc = await SchemaModel.findOne({ projectId });

    if (!schemaDoc) {
      console.log(`No schemas found for project ID: ${projectId}`);
      return {};
    }

    console.log(`Schemas retrieved for project ID: ${projectId}`);
    return schemaDoc.schemas;
  } catch (error) {
    console.error(`Failed to fetch schemas for project ID ${projectId}:`, error);
    throw new Error('Failed to retrieve project schemas.');
  }
};





const generateActionPlan = async (prompt, envVars) => {
  // Check for specific function call patterns
  if (prompt.startsWith('!sendemail to user with id ')) {
    const userId = prompt.split(' ')[5];
    if (userId) {
      return {
        type: 'function_called',
        function: 'sendEmail',
        parameters: { userId }
      };
    }
  }

  // If not a known function call, substitute env vars and generate query plan
  const processedPrompt = substituteEnvVars(prompt, envVars);
  const queryPlan = await generateQueryPlan(processedPrompt);
  
  // Return the query plan with a type for differentiation
  return {
    type: 'query_plan',
    ...queryPlan
  };
};

export { generateExecutionPlan,executePlan,saveSchema,generateFunctionDetails,installUserModules,runUserCode };