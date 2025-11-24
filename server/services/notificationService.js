import nodemailer from 'nodemailer';
import Notification from '../models/Notification.js';
import { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } from '../config/env.js';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // Use 'true' for 465, 'false' for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  // try {
  //   const info = await transporter.sendMail({
  //     from: `"KingKong" <${EMAIL_USER}>`,
  //     to,
  //     subject,
  //     html,
  //   });
  //   console.log(`Email sent: ${info.messageId}`);
  // } catch (error) {
  //   console.error('Failed to send email:', error);
  // }
};

const createInAppNotification = async (userId, title, message) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
    });
    await notification.save();
    console.log('In-app notification created successfully.');
  } catch (error) {
    console.error('Failed to create in-app notification:', error);
  }
};

const getUnreadNotifications = async (userId) => {
  return Notification.find({ userId, read: false }).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};

export {
  sendEmail,
  createInAppNotification,
  getUnreadNotifications,
  markAsRead,
};