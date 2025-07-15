import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Target, Calendar, ChefHat } from 'lucide-react';

const QuickStats: React.FC = () => {
  const quickActions = [
    {
      title: 'Log Food',
      description: 'Track your meal',
      icon: Plus,
      to: '/app/tracker',
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20'
    },
    {
      title: 'View Goals',
      description: 'Check progress',
      icon: Target,
      to: '/app',
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/20'
    },
    {
      title: 'Plan Meals',
      description: 'Weekly planner',
      icon: Calendar,
      to: '/app/planner',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Browse Recipes',
      description: 'Find inspiration',
      icon: ChefHat,
      to: '/app/recipes',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {quickActions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={action.to}>
            <motion.div
              className="p-4 bg-secondary-700 border border-secondary-600 rounded-xl hover:border-primary-500 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
              <p className="text-secondary-400 text-xs">{action.description}</p>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;