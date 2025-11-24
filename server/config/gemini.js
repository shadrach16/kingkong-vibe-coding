import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Access your API key as an environment variable
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Retrieves the Gemini AI model instance.
 * @param {string} modelName The name of the model to use (e.g., 'gemini-pro').
 * @returns The generative model instance.
 */
export const getGenerativeModel = (modelName) => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;