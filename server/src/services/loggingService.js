import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transports = {};

const getLogger = (projectId) => {
  if (!transports[projectId]) {
    const transport = new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '..', 'logs', `${projectId}.log`),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.json(),
    });
    transports[projectId] = transport;
  }

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [transports[projectId]],
  });
};

const log = (projectId, level, message, metadata = {}) => {
  const logger = getLogger(projectId);
  logger.log({
    level,
    message,
    ...metadata,
  });
};

export { log };