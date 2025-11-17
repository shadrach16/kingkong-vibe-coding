import { getUnreadNotifications, markAsRead } from '../services/notificationService.js';

const getNotifications = async (req, res) => {
  try {
    const notifications = await getUnreadNotifications(req.user._id);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markAsRead(id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read.' });
  }
};

export {
  getNotifications,
  markNotificationAsRead,
};