import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`p-4 rounded-xl border backdrop-blur-sm ${getColors(notification.type)} shadow-lg`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {notification.title}
                </h4>
                <p className="text-secondary-300 text-sm leading-relaxed">
                  {notification.message}
                </p>
                
                {notification.action && (
                  <motion.button
                    onClick={notification.action.onClick}
                    className="mt-2 text-primary-400 hover:text-primary-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {notification.action.label}
                  </motion.button>
                )}
              </div>
              
              <motion.button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-secondary-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Smart notification hooks for common use cases
export const useSmartNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyMealLogged = (mealName: string, calories: number) => {
    addNotification({
      type: 'success',
      title: 'Meal Logged Successfully',
      message: `${mealName} (${calories} calories) has been added to your daily tracker.`,
      duration: 3000
    });
  };

  const notifyGoalAchieved = (goalType: string) => {
    addNotification({
      type: 'success',
      title: 'Goal Achieved! 🎉',
      message: `Congratulations! You've reached your ${goalType} goal for today.`,
      duration: 5000
    });
  };

  const notifyMealReminder = (mealType: string) => {
    addNotification({
      type: 'info',
      title: 'Meal Reminder',
      message: `Don't forget to log your ${mealType}!`,
      duration: 0,
      action: {
        label: 'Log Now',
        onClick: () => {
          // Navigate to tracker
          window.location.href = '/app/tracker';
        }
      }
    });
  };

  const notifyHydrationReminder = () => {
    addNotification({
      type: 'info',
      title: 'Stay Hydrated! 💧',
      message: 'Remember to drink water throughout the day.',
      duration: 4000
    });
  };

  const notifyWeeklyReport = () => {
    addNotification({
      type: 'info',
      title: 'Weekly Report Ready',
      message: 'Your nutrition summary for this week is now available.',
      action: {
        label: 'View Report',
        onClick: () => {
          // Navigate to analytics
          window.location.href = '/app/analytics';
        }
      }
    });
  };

  const notifyError = (message: string) => {
    addNotification({
      type: 'error',
      title: 'Something went wrong',
      message,
      duration: 5000
    });
  };

  return {
    notifyMealLogged,
    notifyGoalAchieved,
    notifyMealReminder,
    notifyHydrationReminder,
    notifyWeeklyReport,
    notifyError
  };
};