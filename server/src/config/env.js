import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;


export const SESSION_SECRET = process.env.SESSION_SECRET;
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
export const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;




