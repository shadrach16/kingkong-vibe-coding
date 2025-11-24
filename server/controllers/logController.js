import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getProjectLogs = async (req, res) => {
  const { projectId } = req.params;
  const { level, date, sort } = req.query;

  // Security Check: Ensure the user has access to this project ID
  if (!req.user.projectIds.includes(projectId)) {
    return res.status(403).json({ message: 'Access denied to this project\'s logs.' });
  }

  // Determine the date for the log file. Default to today's date if not provided.
  const logDate = date || new Date().toISOString().slice(0, 10);
  
  // Construct the dynamic log file path based on the project ID and date
  const logFileName = `${projectId}.log.${logDate}`;
  const logFilePath = path.join(__dirname, '..', 'logs', logFileName);
  
  console.log('fp', logFilePath);

  try {
    const logFileContent = await fs.readFile(logFilePath, 'utf-8');
    const logs = logFileContent
      .trim()
      .split('\n')
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null);

    let filteredLogs = logs;
    
    // Filter by log level if specified
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level.toLowerCase());
    }

    // Sort by timestamp if specified, defaulting to latest first
    if (sort === 'latest') {
      filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sort === 'oldest') {
       filteredLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    
    res.status(200).json(filteredLogs);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ message: `No logs found for project '${projectId}' on date '${logDate}'.` });
    }
    res.status(500).json({ message: 'Failed to retrieve logs.' });
  }
};

export { getProjectLogs };