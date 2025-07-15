import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  Flame,
  Zap,
  Apple,
  Calculator,
  Globe,
  Brain
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import NutritionChart from '../components/Charts/NutritionChart';
import QuickStats from '../components/Dashboard/QuickStats';

const DashboardPage: React.FC = () => {
  const { dailyNutrition, meals, personalizedGoals, calculatePersonalizedGoals } = useApp();
  const { user } = useAuth();

  const todaysMeals = meals.filter(meal => 
    meal.date === new Date().toISOString().split('T')[0]
  ).length;

  const statsCards = [
    {
      title: 'Today\'s Calories',
      value: dailyNutrition.calories,
      goal: personalizedGoals.calories,
      icon: Flame,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/20'
    },
    {
      title: 'Protein (g)',
      value: dailyNutrition.protein,
      goal: personalizedGoals.protein,
      icon: Zap,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20'
    },
    {
      title: 'Meals Logged',
      value: todaysMeals,
      goal: 3,
      icon: Apple,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Weekly Streak',
      value: 5,
      goal: 7,
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  // Calculate BMI if user has profile data
  const calculateBMI = () => {
    if (user?.profile?.height && user?.profile?.weight) {
      const heightInMeters = user.profile.height / 100;
      return (user.profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

  return (
    <div className="space-y-8 relative">
      {/* Background with Kenyan tea plantation */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 rounded-2xl p-8 text-white relative z-10 border border-primary-400/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Smart Nutrition Dashboard</h1>
            <p className="text-white/80">
              AI-powered nutrition tracking with personalized insights • Data-driven health optimization
            </p>
            {user?.profile && (
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Goal: {user.profile.goal?.replace('-', ' ') || 'Not set'}</span>
                </div>
                {bmi && (
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>BMI: {bmi}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>AI: Smart Analysis</span>
                </div>
              </div>
            )}
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-12 h-12 text-white/80" />
          </motion.div>
        </div>
      </motion.div>

      {/* Personalized Goals Info */}
      {user?.profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6 relative z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">AI-Calculated Personalized Goals</h2>
            <motion.button
              onClick={calculatePersonalizedGoals}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Brain className="w-4 h-4" />
              <span>AI Recalculate</span>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent-400">{personalizedGoals.calories}</p>
              <p className="text-secondary-400 text-sm">Daily Calories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-400">{personalizedGoals.protein}g</p>
              <p className="text-secondary-400 text-sm">Protein</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{personalizedGoals.carbs}g</p>
              <p className="text-secondary-400 text-sm">Carbs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{personalizedGoals.fat}g</p>
              <p className="text-secondary-400 text-sm">Fat</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{personalizedGoals.water}L</p>
              <p className="text-secondary-400 text-sm">Water</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <p className="text-primary-300 text-sm">
              <strong>🧠 AI-Calculated based on:</strong> Your profile + nutrition science + metabolic factors + activity level. 
              Personalized nutrition goals optimized for your health objectives.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6 hover:border-primary-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            
            <h3 className="text-secondary-400 text-sm font-medium mb-1">{card.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">{card.value}</span>
              <span className="text-secondary-400 text-sm">/ {card.goal}</span>
            </div>
            
            <div className="mt-3 bg-secondary-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${card.color.replace('text-', 'bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((card.value / card.goal) * 100, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Today's Nutrition</h2>
          <NutritionChart data={dailyNutrition} goals={personalizedGoals} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <QuickStats />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6 relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            View All
          </button>
        </div>
        
        {meals.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
            <p className="text-secondary-400 mb-2">No meals logged yet</p>
            <p className="text-secondary-500 text-sm">Start tracking your meals to see your progress here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.slice(0, 5).map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-secondary-700/50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-white">{meal.name}</h4>
                  <p className="text-secondary-400 text-sm">{meal.time} • {meal.calories} calories</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-medium">{meal.protein}g protein</p>
                  <p className="text-secondary-400 text-sm">{meal.carbs}g carbs • {meal.fat}g fat</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;