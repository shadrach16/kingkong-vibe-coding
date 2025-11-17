import { generateExecutionPlan,executePlan,saveSchema  } from '../services/aiService.js';
import { executeQueryPlan } from '../services/queryGenerator.js';
import { incrementTaskUsage } from '../services/billingService.js';
import { log } from '../services/loggingService.js';

const runAiTask = async (req, res) => {
  const { prompts, projectId, variables, attachment_variables, settings } = req.body;
  
  // console.log("Received attachment_variables:", attachment_variables);

  if (!prompts || !projectId) {
    return res.status(400).json({ message: 'prompts and projectId are required.' });
  }

  try {
    // Pass the new attachment_variables to the AI service
    await incrementTaskUsage(req.user._id);
    const actionPlan = await generateExecutionPlan(projectId, prompts, variables, attachment_variables);
    if (actionPlan.updated_schemas){
    saveSchema(projectId,actionPlan.updated_schemas)
    }
    const result =  await executePlan(actionPlan.execution_plan, projectId,variables)
    

    log(projectId, 'info', 'AI task executed successfully.', {
      userId: req.user._id,
      prompts,
      queryPlan: actionPlan,
      resultCount:  result.length,
    });

    res.status(200).json({
      message: 'AI task executed successfully.',
      result:JSON.parse(JSON.stringify(result)),
    });
  } catch (error) {
    log(projectId, 'error', 'AI task execution failed.', {
      userId: req.user._id,
      prompts,
      errorMessage: error.message,
    });

    res.status(500).json({ message: error.message || 'Failed to execute AI task.' });
  }
};

export { runAiTask };