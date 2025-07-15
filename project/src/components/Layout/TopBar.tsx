import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, User, LogOut, Crown, Moon, Sun, Globe, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Meal reminder', message: 'Time for your afternoon snack!', time: '2 min ago', unread: true },
    { id: 2, title: 'Weekly report', message: 'Your nutrition summary is ready', time: '1 hour ago', unread: true },
    { id: 3, title: 'Recipe suggestion', message: 'Try this new Kenyan recipe!', time: '3 hours ago', unread: false },
  ];

  const settingsOptions = [
    { icon: Moon, label: 'Dark Mode', description: 'Toggle dark/light theme', action: () => console.log('Toggle theme') },
    { icon: Bell, label: 'Notifications', description: 'Manage notification preferences', action: () => console.log('Notification settings') },
    { icon: Globe, label: 'Language', description: 'English, Swahili', action: () => console.log('Language settings') },
    { icon: Shield, label: 'Privacy', description: 'Data and privacy settings', action: () => console.log('Privacy settings') },
    { icon: Crown, label: 'Subscription', description: 'Manage your premium plan', action: () => console.log('Subscription settings') },
  ];

  const profileOptions = [
    { label: 'Personal Info', description: 'Update your profile details', action: () => console.log('Personal info') },
    { label: 'Health Goals', description: 'Set your nutrition targets', action: () => console.log('Health goals') },
    { label: 'Dietary Preferences', description: 'Allergies and restrictions', action: () => console.log('Dietary preferences') },
    { label: 'Activity Level', description: 'Update your fitness level', action: () => console.log('Activity level') },
  ];

  return (
    <header className="bg-secondary-800 border-b border-secondary-700 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <motion.h2 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Welcome back, {user?.name}!
          </motion.h2>
          <motion.p 
            className="text-secondary-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Ready to maintain your afya today?
          </motion.p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-xl transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-secondary-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Notifications
              </div>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-secondary-800 border border-secondary-700 rounded-xl shadow-xl z-50"
                >
                  <div className="p-4 border-b border-secondary-700">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 border-b border-secondary-700 last:border-b-0 hover:bg-secondary-700 transition-colors ${
                          notification.unread ? 'bg-primary-500/5' : ''
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-white text-sm">{notification.title}</p>
                            <p className="text-secondary-400 text-xs mt-1">{notification.message}</p>
                          </div>
                          <span className="text-secondary-500 text-xs">{notification.time}</span>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <div className="relative">
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-xl transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-secondary-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Settings
              </div>
            </motion.button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-secondary-800 border border-secondary-700 rounded-xl shadow-xl z-50"
                >
                  <div className="p-4 border-b border-secondary-700">
                    <h3 className="font-semibold text-white">Settings</h3>
                  </div>
                  <div className="p-2">
                    {settingsOptions.map((option, index) => (
                      <motion.button
                        key={option.label}
                        onClick={option.action}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-700 transition-colors text-left"
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <option.icon className="w-4 h-4 text-primary-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{option.label}</p>
                          <p className="text-secondary-400 text-xs">{option.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative flex items-center space-x-3">
            <div className="relative">
              <motion.button
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Profile"
              >
                <User className="w-5 h-5" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-secondary-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Profile
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-secondary-800 border border-secondary-700 rounded-xl shadow-xl z-50"
                  >
                    <div className="p-4 border-b border-secondary-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{user?.name}</h3>
                          <p className="text-secondary-400 text-sm">{user?.email}</p>
                          {user?.isPremium && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Crown className="w-3 h-3 text-accent-400" />
                              <span className="text-accent-400 text-xs font-medium">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {profileOptions.map((option, index) => (
                        <motion.button
                          key={option.label}
                          onClick={option.action}
                          className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-700 transition-colors text-left"
                          whileHover={{ x: 4 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{option.label}</p>
                            <p className="text-secondary-400 text-xs">{option.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={logout}
              className="p-3 text-secondary-400 hover:text-red-400 hover:bg-secondary-700 rounded-xl transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-secondary-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Logout
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showSettings || showProfile || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSettings(false);
            setShowProfile(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default TopBar;