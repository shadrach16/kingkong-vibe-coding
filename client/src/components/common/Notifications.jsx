import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle,  CheckCircle, Loader, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const fetchedNotifications = await notificationService.getNotifications(user.apiKey);
        setNotifications(fetchedNotifications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notification) => {
    try {
      await notificationService.markAsRead(notification._id, user.apiKey);
      setNotifications(notifications.filter(n => n._id !== notification._id));
      navigate('/dashboard'); // Example redirect
    } catch (err) {
      setError(err.message);
    }
  };

  const NotificationCard = ({ notification }) => (
    <div
      onClick={() => handleNotificationClick(notification)}
      className={`
        flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200
        ${notification.read ? 'bg-gray-50 text-gray-500' : 'bg-white hover:bg-gray-50 shadow-sm'}
      `}
    >
      <div className="flex-shrink-0 mt-1">
        <Bell size={18} className="text-gray-400" />
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-400' : 'text-gray-800'}`}>
          {notification.title}
        </h4>
        <p className={`text-xs mt-1 ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
          {notification.message}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
          <ArrowRight size={14} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <Loader size={24} className="animate-spin text-indigo-500" />
          <p className="mt-4 text-sm text-gray-500">Fetching notifications...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-red-500">
          <AlertCircle size={24} />
          <p className="mt-4 text-sm text-center">
            <span className="font-semibold">Error fetching notifications:</span> {error}
          </p>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <CheckCircle size={24} className="text-green-500" />
          <p className="mt-4 text-sm text-gray-500">You're all caught up! No new notifications.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.map(notification => (
          <NotificationCard key={notification._id} notification={notification} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bell size={20} className="text-gray-600" />
          Notifications
        </h3>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
          Mark all as read
        </button>
      </div>
      <div className="p-6 max-h-[400px] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Notifications;