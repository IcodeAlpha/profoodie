import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Clock, 
  Trash2, 
  Edit3, 
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Apple,
  Coffee,
  Utensils,
  Moon,
  Brain,
  X,
  Timer,
  Play,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react';
import { format, addDays, subDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import NutritionChart from '../components/Charts/NutritionChart';
import NutritionEstimator from '../components/AI/NutritionEstimator';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  targetHours: number;
  isActive: boolean;
}

const TrackerPage: React.FC = () => {
  const { meals, addMeal, removeMeal, personalizedGoals } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAIEstimator, setShowAIEstimator] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '1',
    unit: 'serving'
  });

  // Fasting state
  const [fastingSessions, setFastingSessions] = useState<FastingSession[]>([]);
  const [showFastingTracker, setShowFastingTracker] = useState(false);
  const [fastingTarget, setFastingTarget] = useState(16);

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { id: 'lunch', label: 'Lunch', icon: Utensils, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'snacks', label: 'Snacks', icon: Apple, color: 'text-purple-400', bgColor: 'bg-purple-500/20' }
  ];

  // Common healthy foods database
  const commonFoods: FoodItem[] = [
    { id: '1', name: 'White Rice (1 cup)', calories: 205, protein: 4, carbs: 45, fat: 0, quantity: 1, unit: 'cup' },
    { id: '2', name: 'Grilled Chicken (100g)', calories: 165, protein: 31, carbs: 0, fat: 4, quantity: 100, unit: 'g' },
    { id: '3', name: 'Pasta (1 cup)', calories: 220, protein: 8, carbs: 44, fat: 1, quantity: 1, unit: 'cup' },
    { id: '4', name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, quantity: 100, unit: 'g' },
    { id: '5', name: 'Avocado (1 medium)', calories: 234, protein: 3, carbs: 12, fat: 21, quantity: 1, unit: 'piece' },
    { id: '6', name: 'Quinoa (1 cup)', calories: 222, protein: 8, carbs: 39, fat: 4, quantity: 1, unit: 'cup' },
    { id: '7', name: 'Greek Yogurt (1 cup)', calories: 130, protein: 23, carbs: 9, fat: 0, quantity: 1, unit: 'cup' },
    { id: '8', name: 'Sweet Potato (1 medium)', calories: 112, protein: 2, carbs: 26, fat: 0, quantity: 1, unit: 'piece' },
    { id: '9', name: 'Almonds (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14, quantity: 1, unit: 'oz' },
    { id: '10', name: 'Broccoli (1 cup)', calories: 25, protein: 3, carbs: 5, fat: 0, quantity: 1, unit: 'cup' }
  ];

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate daily nutrition for selected date
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const todaysMeals = meals.filter(meal => meal.date === selectedDateString);
  
  const dailyNutrition = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const mealsByType = mealTypes.reduce((acc, type) => {
    acc[type.id] = todaysMeals.filter(meal => meal.time === type.id);
    return acc;
  }, {} as Record<string, any[]>);

  // Fasting logic
  const activeFasting = fastingSessions.find(session => session.isActive);
  
  const startFasting = () => {
    const newSession: FastingSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      targetHours: fastingTarget,
      isActive: true
    };
    setFastingSessions(prev => [...prev, newSession]);
  };

  const endFasting = () => {
    if (activeFasting) {
      setFastingSessions(prev => 
        prev.map(session => 
          session.id === activeFasting.id 
            ? { ...session, endTime: new Date(), isActive: false }
            : session
        )
      );
    }
  };

  const resetFasting = () => {
    if (activeFasting) {
      setFastingSessions(prev => prev.filter(session => session.id !== activeFasting.id));
    }
  };

  const getFastingProgress = () => {
    if (!activeFasting) return { hours: 0, minutes: 0, percentage: 0 };
    
    const now = new Date();
    const totalMinutes = differenceInMinutes(now, activeFasting.startTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const percentage = Math.min((totalMinutes / (activeFasting.targetHours * 60)) * 100, 100);
    
    return { hours, minutes, percentage };
  };

  const fastingProgress = getFastingProgress();

  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleAddFood = (food: FoodItem) => {
    addMeal({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      time: selectedMealType,
      date: selectedDateString
    });
    setShowAddFood(false);
  };

  const handleAddCustomFood = () => {
    if (customFood.name && customFood.calories) {
      addMeal({
        name: customFood.name,
        calories: parseInt(customFood.calories),
        protein: parseInt(customFood.protein) || 0,
        carbs: parseInt(customFood.carbs) || 0,
        fat: parseInt(customFood.fat) || 0,
        time: selectedMealType,
        date: selectedDateString
      });
      setCustomFood({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        quantity: '1',
        unit: 'serving'
      });
      setShowAddFood(false);
    }
  };

  const handleAIEstimation = (nutritionData: any) => {
    addMeal({
      name: `${nutritionData.name} (AI estimated)`,
      calories: nutritionData.calories,
      protein: nutritionData.protein,
      carbs: nutritionData.carbs,
      fat: nutritionData.fat,
      time: selectedMealType,
      date: selectedDateString
    });
    setShowAIEstimator(false);
    setShowAddFood(false);
  };

  const caloriesRemaining = personalizedGoals.calories - dailyNutrition.calories;

  return (
    <div className="space-y-8 relative">
      {/* Background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Header with Day Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Daily Tracker</h1>
          <p className="text-secondary-400">Track your meals, monitor nutrition goals, and manage fasting</p>
        </div>
        
        {/* Day Navigation */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowFastingTracker(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Timer className="w-4 h-4" />
            <span>Fasting Tracker</span>
          </motion.button>
          
          <motion.button
            onClick={handlePrevDay}
            className="p-2 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-white hover:border-primary-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="px-6 py-3 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-center min-w-[200px]">
            <p className="text-white font-semibold">{format(selectedDate, 'EEEE')}</p>
            <p className="text-secondary-400 text-sm">{format(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          
          <motion.button
            onClick={handleNextDay}
            className="p-2 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-white hover:border-primary-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Fasting Status Bar */}
      {activeFasting && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 relative z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Fasting in Progress</h3>
                <p className="text-purple-300">
                  {fastingProgress.hours}h {fastingProgress.minutes}m / {activeFasting.targetHours}h target
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">{Math.round(fastingProgress.percentage)}%</p>
              <p className="text-secondary-400 text-sm">Complete</p>
            </div>
          </div>
          <div className="mt-4 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${fastingProgress.percentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Calories</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{dailyNutrition.calories}</p>
          <p className="text-secondary-400 text-sm">
            {caloriesRemaining > 0 ? `${caloriesRemaining} remaining` : `${Math.abs(caloriesRemaining)} over goal`}
          </p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dailyNutrition.calories / personalizedGoals.calories) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Protein</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{dailyNutrition.protein}g</p>
          <p className="text-secondary-400 text-sm">of {personalizedGoals.protein}g goal</p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dailyNutrition.protein / personalizedGoals.protein) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Carbs</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{dailyNutrition.carbs}g</p>
          <p className="text-secondary-400 text-sm">of {personalizedGoals.carbs}g goal</p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dailyNutrition.carbs / personalizedGoals.carbs) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Fat</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{dailyNutrition.fat}g</p>
          <p className="text-secondary-400 text-sm">of {personalizedGoals.fat}g goal</p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dailyNutrition.fat / personalizedGoals.fat) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Meal Sections */}
        <div className="lg:col-span-2 space-y-6">
          {mealTypes.map((mealType, index) => (
            <motion.div
              key={mealType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${mealType.bgColor} rounded-lg flex items-center justify-center`}>
                    <mealType.icon className={`w-5 h-5 ${mealType.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{mealType.label}</h3>
                  <span className="text-secondary-400 text-sm">
                    ({mealsByType[mealType.id]?.reduce((sum, meal) => sum + meal.calories, 0) || 0} cal)
                  </span>
                </div>
                <motion.button
                  onClick={() => {
                    setSelectedMealType(mealType.id);
                    setShowAddFood(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Food</span>
                </motion.button>
              </div>

              <div className="space-y-3">
                {mealsByType[mealType.id]?.length > 0 ? (
                  mealsByType[mealType.id].map((meal, mealIndex) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mealIndex * 0.1 }}
                      className="flex items-center justify-between p-4 bg-secondary-700/50 rounded-lg group hover:bg-secondary-700 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{meal.name}</h4>
                        <div className="flex items-center space-x-4 text-secondary-400 text-sm">
                          <span>{meal.calories} cal</span>
                          <span>{meal.protein}g protein</span>
                          <span>{meal.carbs}g carbs</span>
                          <span>{meal.fat}g fat</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          className="p-2 text-secondary-400 hover:text-primary-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => removeMeal(meal.id)}
                          className="p-2 text-secondary-400 hover:text-red-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-12 h-12 ${mealType.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <mealType.icon className={`w-6 h-6 ${mealType.color}`} />
                    </div>
                    <p className="text-secondary-400 mb-2">No {mealType.label.toLowerCase()} logged yet</p>
                    <motion.button
                      onClick={() => {
                        setSelectedMealType(mealType.id);
                        setShowAddFood(true);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Add your first {mealType.label.toLowerCase()}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nutrition Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Today's Nutrition</h3>
          <NutritionChart data={dailyNutrition} goals={personalizedGoals} />
        </motion.div>
      </div>

      {/* Fasting Tracker Modal */}
      {showFastingTracker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowFastingTracker(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Fasting Tracker</h3>
              <button
                onClick={() => setShowFastingTracker(false)}
                className="text-secondary-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {activeFasting ? (
              <div className="space-y-6">
                {/* Active Fasting Display */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-secondary-700"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        className="text-purple-500"
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 40 * (1 - fastingProgress.percentage / 100)
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{fastingProgress.hours}h</p>
                        <p className="text-xs text-secondary-400">{fastingProgress.minutes}m</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white font-semibold mb-2">
                    {fastingProgress.hours}h {fastingProgress.minutes}m / {activeFasting.targetHours}h
                  </p>
                  <p className="text-secondary-400 text-sm">
                    Started: {format(activeFasting.startTime, 'MMM d, h:mm a')}
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    onClick={endFasting}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Square className="w-4 h-4" />
                    <span>End Fast</span>
                  </motion.button>
                  <motion.button
                    onClick={resetFasting}
                    className="flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fasting Target Selection */}
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-3">
                    Fasting Target (hours)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[12, 16, 18, 20, 24, 36].map((hours) => (
                      <motion.button
                        key={hours}
                        onClick={() => setFastingTarget(hours)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          fastingTarget === hours
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-secondary-600 bg-secondary-700/50 text-secondary-300 hover:border-secondary-500'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <p className="font-bold">{hours}h</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Start Fasting Button */}
                <motion.button
                  onClick={startFasting}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Start {fastingTarget}h Fast</span>
                </motion.button>

                {/* Fasting Benefits */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-medium mb-2">Fasting Benefits</h4>
                  <ul className="text-secondary-300 text-sm space-y-1">
                    <li>• Improved insulin sensitivity</li>
                    <li>• Enhanced fat burning</li>
                    <li>• Cellular autophagy</li>
                    <li>• Mental clarity</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Recent Fasting History */}
            {fastingSessions.filter(s => !s.isActive).length > 0 && (
              <div className="mt-6 pt-6 border-t border-secondary-700">
                <h4 className="text-white font-medium mb-3">Recent Fasts</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {fastingSessions
                    .filter(session => !session.isActive)
                    .slice(-3)
                    .map((session) => {
                      const duration = session.endTime 
                        ? differenceInHours(session.endTime, session.startTime)
                        : 0;
                      return (
                        <div key={session.id} className="flex justify-between text-sm">
                          <span className="text-secondary-400">
                            {format(session.startTime, 'MMM d')}
                          </span>
                          <span className="text-white font-medium">{duration}h</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Add Food Modal */}
      {showAddFood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddFood(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Add Food to {mealTypes.find(m => m.id === selectedMealType)?.label}
              </h3>
              <button
                onClick={() => setShowAddFood(false)}
                className="text-secondary-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* AI Assistant Button */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Don't know the nutrition info?</h4>
                    <p className="text-secondary-300 text-sm">Let our AI help estimate it for you!</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowAIEstimator(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Brain className="w-4 h-4" />
                  <span>Use AI</span>
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for food..."
                className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Common Foods */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Popular Healthy Foods</h4>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {filteredFoods.map((food) => (
                  <motion.div
                    key={food.id}
                    className="flex items-center justify-between p-3 bg-secondary-700 rounded-lg hover:bg-secondary-600 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleAddFood(food)}
                  >
                    <div>
                      <h5 className="font-medium text-white">{food.name}</h5>
                      <p className="text-secondary-400 text-sm">
                        {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-primary-400" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Food Entry */}
            <div className="border-t border-secondary-700 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Add Custom Food</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={customFood.name}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Food name"
                  className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={customFood.calories}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="Calories"
                  className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={customFood.protein}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, protein: e.target.value }))}
                  placeholder="Protein (g)"
                  className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={customFood.carbs}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, carbs: e.target.value }))}
                  placeholder="Carbs (g)"
                  className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={customFood.fat}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, fat: e.target.value }))}
                  placeholder="Fat (g)"
                  className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
                <motion.button
                  onClick={handleAddCustomFood}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Custom Food
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* AI Nutrition Estimator Modal */}
      {showAIEstimator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAIEstimator(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">AI Nutrition Assistant</h3>
              <button
                onClick={() => setShowAIEstimator(false)}
                className="text-secondary-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <NutritionEstimator
              onEstimationComplete={handleAIEstimation}
              onClose={() => setShowAIEstimator(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackerPage;