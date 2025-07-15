import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  ChefHat,
  Crown,
  Utensils,
  Sparkles,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/app/planner', icon: Calendar, label: 'Meal Planner' },
    { to: '/app/tracker', icon: Target, label: 'Daily Tracker' },
    { to: '/app/recipes', icon: ChefHat, label: 'Recipes' },
    { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-70 bg-secondary-800 border-r border-secondary-700 h-screen sticky top-0"
    >
      <div className="p-6">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Enhanced Animated Logo */}
          <div className="relative">
            <motion.div
              className="relative w-14 h-14 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30"
              animate={{ 
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Main utensils icon */}
              <motion.div
                animate={{ 
                  rotate: 360
                }}
                transition={{ 
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Utensils className="w-7 h-7 text-white" />
              </motion.div>
              
              {/* Animated sparkles around the logo */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-3 h-3 text-accent-400" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Sparkles className="w-2 h-2 text-primary-300" />
              </motion.div>
              
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl opacity-20"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.05, 0.2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Orbiting elements */}
              <motion.div
                className="absolute w-2 h-2 bg-accent-400 rounded-full"
                style={{ top: '5%', left: '50%', transformOrigin: '0 25px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-primary-300 rounded-full"
                style={{ top: '15%', right: '5%', transformOrigin: '-15px 20px' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ bottom: '10%', left: '20%', transformOrigin: '10px -15px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          
          <div>
            <motion.h1 
              className="text-xl font-bold"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: 'linear-gradient(90deg, #059669, #f97316, #059669)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <span className="lowercase font-light">pro</span>
              <span className="uppercase font-black">FOODIE</span>
            </motion.h1>
            <motion.p 
              className="text-xs text-secondary-400 italic"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Smart Nutrition AI
            </motion.p>
          </div>
        </motion.div>
      </div>

      <nav className="px-6 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                } ${item.premium && !user?.isPremium ? 'opacity-60' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Community Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mt-8 p-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-xl"
      >
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Health Community</span>
          </div>
          <p className="text-secondary-300 text-sm mb-3">
            Connect with health enthusiasts and share nutrition tips!
          </p>
          <motion.button
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Community
          </motion.button>
        </div>
      </motion.div>

      {/* User Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mx-6 mt-6 p-4 bg-secondary-700/50 rounded-xl border border-secondary-600"
      >
        <h4 className="text-white font-medium mb-3 text-sm">Quick Stats</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-secondary-400">Streak</span>
            <span className="text-primary-400 font-medium">7 days 🔥</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-secondary-400">Meals Logged</span>
            <span className="text-accent-400 font-medium">156</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-secondary-400">Goals Hit</span>
            <span className="text-green-400 font-medium">92%</span>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;