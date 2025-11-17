import app from './app.js';
import connectDB from './config/db.js';
import { PORT } from './config/env.js';
import './config/gemini.js'; // Ensure the config loads at startup
import './config/cloudinary.js'; // Ensure the config loads at startup


// Connect to the database before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to the database. Server not started.", err);
});