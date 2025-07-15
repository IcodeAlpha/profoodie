import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Award,
  Activity,
  Flame,
  Zap,
  Heart,
  Download,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Brain
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('calories');
  const [expandedInsights, setExpandedInsights] = useState<{ [key: number]: boolean }>({});

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Last 3 Months' },
    { id: 'year', label: 'This Year' }
  ];

  const metrics = [
    { id: 'calories', label: 'Calories', icon: Flame, color: 'text-accent-400' },
    { id: 'protein', label: 'Protein', icon: Zap, color: 'text-primary-400' },
    { id: 'carbs', label: 'Carbs', icon: Activity, color: 'text-blue-400' },
    { id: 'fat', label: 'Fat', icon: Heart, color: 'text-yellow-400' }
  ];

  // Mock data - in real app, this would come from your backend
  const weeklyData = [
    { day: 'Mon', calories: 1850, protein: 120, carbs: 180, fat: 65, goal: 2000 },
    { day: 'Tue', calories: 2100, protein: 140, carbs: 220, fat: 75, goal: 2000 },
    { day: 'Wed', calories: 1950, protein: 130, carbs: 190, fat: 70, goal: 2000 },
    { day: 'Thu', calories: 2200, protein: 150, carbs: 240, fat: 80, goal: 2000 },
    { day: 'Fri', calories: 1800, protein: 110, carbs: 170, fat: 60, goal: 2000 },
    { day: 'Sat', calories: 2300, protein: 160, carbs: 260, fat: 85, goal: 2000 },
    { day: 'Sun', calories: 2000, protein: 135, carbs: 200, fat: 72, goal: 2000 }
  ];

  const insights = [
    {
      title: 'Protein Intake Improving',
      description: 'You\'ve increased protein by 15% this week',
      trend: 'up',
      value: '+15%',
      color: 'text-green-400',
      explanation: 'Our AI detected that you\'ve been consistently choosing protein-rich foods like nyama choma, fish, and beans. This improvement supports muscle building and helps you feel fuller for longer.',
      recommendations: [
        'Continue including lean proteins in every meal',
        'Try adding eggs to your breakfast for sustained energy',
        'Consider plant-based proteins like lentils and chickpeas'
      ]
    },
    {
      title: 'Calorie Consistency',
      description: 'Great job staying within your calorie goals',
      trend: 'up',
      value: '6/7 days',
      color: 'text-primary-400',
      explanation: 'You\'ve maintained excellent portion control and made smart food choices. This consistency is key to achieving your health goals sustainably.',
      recommendations: [
        'Keep up the great work with portion sizes',
        'Plan your meals in advance to maintain consistency',
        'Allow yourself one flexible meal per week'
      ]
    },
    {
      title: 'Hydration Alert',
      description: 'Consider increasing water intake',
      trend: 'down',
      value: '-12%',
      color: 'text-yellow-400',
      explanation: 'Your water intake has decreased this week. Proper hydration is crucial for metabolism, energy levels, and overall health, especially in Kenya\'s climate.',
      recommendations: [
        'Aim for 8-10 glasses of water daily',
        'Set reminders on your phone to drink water',
        'Include water-rich foods like watermelon and cucumber'
      ]
    },
    {
      title: 'Meal Timing',
      description: 'Regular meal times detected',
      trend: 'up',
      value: 'Excellent',
      color: 'text-green-400',
      explanation: 'You\'ve been eating at consistent times, which helps regulate your metabolism and blood sugar levels. This pattern supports better digestion and energy stability.',
      recommendations: [
        'Maintain your current meal schedule',
        'Try to eat your largest meal earlier in the day',
        'Keep healthy snacks available for between meals'
      ]
    }
  ];

  const achievements = [
    { title: '7-Day Streak', description: 'Logged meals for 7 consecutive days', icon: '🔥', unlocked: true },
    { title: 'Protein Master', description: 'Hit protein goals 5 days in a row', icon: '💪', unlocked: true },
    { title: 'Balanced Eater', description: 'Maintained macro balance for a week', icon: '⚖️', unlocked: false },
    { title: 'Kenyan Foodie', description: 'Tried 10 different local recipes', icon: '🇰🇪', unlocked: true }
  ];

  const nutritionBreakdown = {
    calories: { current: 14200, goal: 14000, percentage: 101 },
    protein: { current: 945, goal: 1050, percentage: 90 },
    carbs: { current: 1460, goal: 1750, percentage: 83 },
    fat: { current: 507, goal: 455, percentage: 111 }
  };

  const getMaxValue = () => {
    return Math.max(...weeklyData.map(d => Math.max(d.calories, d.goal)));
  };

  const toggleInsightExpansion = (index: number) => {
    setExpandedInsights(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-secondary-400">Track your nutrition progress and insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
          >
            {timeRanges.map(range => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>
          
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(nutritionBreakdown).map(([key, data], index) => {
          const metric = metrics.find(m => m.id === key);
          if (!metric) return null;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-${metric.color.split('-')[1]}-500/20 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`text-right ${data.percentage >= 100 ? 'text-green-400' : data.percentage >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {data.percentage >= 100 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </div>
              
              <h3 className="text-secondary-400 text-sm font-medium mb-1">{metric.label}</h3>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-2xl font-bold text-white">{data.current.toLocaleString()}</span>
                <span className="text-secondary-400 text-sm">/ {data.goal.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${data.percentage >= 100 ? 'text-green-400' : data.percentage >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {data.percentage}% of goal
                </span>
              </div>
              
              <div className="mt-3 bg-secondary-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${data.percentage >= 100 ? 'bg-green-500' : data.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(data.percentage, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-800 border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
            <div className="flex items-center space-x-2">
              {metrics.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === metric.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-700 text-secondary-400 hover:text-white'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {weeklyData.map((day, index) => {
              const value = day[selectedMetric as keyof typeof day] as number;
              const maxValue = getMaxValue();
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={day.day} className="flex items-center space-x-4">
                  <span className="text-secondary-400 text-sm w-8">{day.day}</span>
                  <div className="flex-1 bg-secondary-700 rounded-full h-3 relative">
                    <motion.div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                    {selectedMetric === 'calories' && (
                      <div 
                        className="absolute top-0 h-3 w-1 bg-white/50 rounded-full"
                        style={{ left: `${(day.goal / maxValue) * 100}%` }}
                      />
                    )}
                  </div>
                  <span className="text-white text-sm w-16 text-right">{value}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-secondary-400">
            <span>Daily {selectedMetric} intake</span>
            {selectedMetric === 'calories' && <span>White line = Goal</span>}
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary-800 border border-secondary-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">AI Insights</h3>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-secondary-700/50 rounded-lg cursor-pointer hover:bg-secondary-700 transition-colors"
                  onClick={() => toggleInsightExpansion(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      insight.trend === 'up' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                    }`}>
                      {insight.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-sm ${insight.color}`}>
                            {insight.value}
                          </span>
                          {expandedInsights[index] ? (
                            <ChevronUp className="w-4 h-4 text-secondary-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-secondary-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-secondary-400 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {expandedInsights[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-4 bg-secondary-800/50 rounded-lg border border-secondary-600"
                    >
                      <div className="space-y-4">
                        {/* AI Explanation */}
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary-500/20 rounded-lg flex items-center justify-center mt-0.5">
                            <Brain className="w-3 h-3 text-primary-400" />
                          </div>
                          <div>
                            <h5 className="text-primary-300 font-medium text-sm mb-1">AI Analysis</h5>
                            <p className="text-secondary-300 text-sm leading-relaxed">{insight.explanation}</p>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-accent-500/20 rounded-lg flex items-center justify-center mt-0.5">
                            <Lightbulb className="w-3 h-3 text-accent-400" />
                          </div>
                          <div>
                            <h5 className="text-accent-300 font-medium text-sm mb-2">Recommendations</h5>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-start space-x-2 text-secondary-300 text-sm">
                                  <span className="text-accent-400 mt-1">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How AI Insights Work */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">How AI Insights Work</h3>
            <p className="text-secondary-300 text-sm leading-relaxed mb-4">
              Our AI analyzes your eating patterns, nutrition trends, and health goals to provide personalized insights. 
              It considers factors like meal timing, nutrient balance, portion consistency, and progress toward your goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-secondary-300">Pattern Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                <span className="text-secondary-300">Trend Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-secondary-300">Personalized Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-secondary-800 border border-secondary-700 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
          <span className="text-secondary-400 text-sm">
            {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-secondary-600 bg-secondary-700/50'
              }`}
            >
              <div className="text-center">
                <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-semibold mb-1 ${achievement.unlocked ? 'text-white' : 'text-secondary-400'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${achievement.unlocked ? 'text-secondary-300' : 'text-secondary-500'}`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <Award className="w-4 h-4 text-primary-400 mx-auto" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;