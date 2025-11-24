// logger.js
export const logger = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const ms = (duration[0] * 1e3) + (duration[1] / 1e6);
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${ms.toFixed(3)}ms`;
    console.log(logMessage);
  });

  next();
};

export const errorLogger = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(err.stack);
  next(err);
};