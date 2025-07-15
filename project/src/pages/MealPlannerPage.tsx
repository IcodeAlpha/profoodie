import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, Users, ChefHat, Trash2, ChevronLeft, ChevronRight, X, Brain, Calculator } from 'lucide-react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import NutritionEstimator from '../components/AI/NutritionEstimator';

const MealPlannerPage: React.FC = () => {
  const { recipes, addMeal, addRecipe, updateMealPlan, getMealPlan, personalizedGoals } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAIEstimator, setShowAIEstimator] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{day: Date, mealType: string} | null>(null);
  const [showCreateCustomMeal, setShowCreateCustomMeal] = useState(false);
  const [customMeal, setCustomMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    cookTime: '',
    servings: ''
  });
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handlePrevWeek = () => {
    setSelectedDate(prev => subDays(prev, 7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  const handleAddMealToSlot = (day: Date, mealType: string) => {
    setSelectedSlot({ day, mealType });
    setShowAddMeal(true);
  };

  const handleSelectRecipe = (recipe: any) => {
    if (selectedSlot) {
      const dayKey = format(selectedSlot.day, 'yyyy-MM-dd');
      
      // Update meal plan using the context method
      updateMealPlan(dayKey, selectedSlot.mealType, recipe);
      
      // Also add to daily tracker
      addMeal({
        name: recipe.name,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        time: selectedSlot.mealType.toLowerCase(),
        date: dayKey
      });
      
      setShowAddMeal(false);
      setSelectedSlot(null);
    }
  };

  const handleAIEstimation = (nutritionData: any) => {
    if (selectedSlot) {
      // Create the meal object
      const newMeal = {
        id: Math.random().toString(36).substr(2, 9),
        name: nutritionData.name,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
        cookTime: 30,
        servings: 1,
        ingredients: ['AI estimated meal'],
        instructions: ['Prepared as described']
      };

      // Add to recipes for future use
      addRecipe(newMeal);

      // Add to meal plan using context method
      const dayKey = format(selectedSlot.day, 'yyyy-MM-dd');
      updateMealPlan(dayKey, selectedSlot.mealType, newMeal);
      
      // Also add to daily tracker
      addMeal({
        name: newMeal.name,
        calories: newMeal.calories,
        protein: newMeal.protein,
        carbs: newMeal.carbs,
        fat: newMeal.fat,
        time: selectedSlot.mealType.toLowerCase(),
        date: dayKey
      });

      setShowAIEstimator(false);
      setShowAddMeal(false);
      setSelectedSlot(null);
    }
  };

  const calculateCaloriesFromMacros = () => {
    const protein = parseInt(customMeal.protein) || 0;
    const carbs = parseInt(customMeal.carbs) || 0;
    const fat = parseInt(customMeal.fat) || 0;
    
    // Calories calculation: Protein = 4 cal/g, Carbs = 4 cal/g, Fat = 9 cal/g
    const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
    
    setCustomMeal(prev => ({
      ...prev,
      calories: calculatedCalories.toString()
    }));
  };

  const handleCreateCustomMeal = () => {
    if (customMeal.name && customMeal.calories && selectedSlot) {
      // Create the meal object
      const newMeal = {
        id: Math.random().toString(36).substr(2, 9),
        name: customMeal.name,
        calories: parseInt(customMeal.calories),
        protein: parseInt(customMeal.protein) || 0,
        carbs: parseInt(customMeal.carbs) || 0,
        fat: parseInt(customMeal.fat) || 0,
        cookTime: parseInt(customMeal.cookTime) || 30,
        servings: parseInt(customMeal.servings) || 1,
        ingredients: ['Custom meal'],
        instructions: ['Prepare as desired']
      };

      // Add to recipes for future use
      addRecipe(newMeal);

      // Add to meal plan using context method
      const dayKey = format(selectedSlot.day, 'yyyy-MM-dd');
      updateMealPlan(dayKey, selectedSlot.mealType, newMeal);
      
      // Also add to daily tracker
      addMeal({
        name: newMeal.name,
        calories: newMeal.calories,
        protein: newMeal.protein,
        carbs: newMeal.carbs,
        fat: newMeal.fat,
        time: selectedSlot.mealType.toLowerCase(),
        date: dayKey
      });

      // Reset form and close modals
      setCustomMeal({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        cookTime: '',
        servings: ''
      });
      setShowCreateCustomMeal(false);
      setShowAddMeal(false);
      setSelectedSlot(null);
    }
  };

  const removeMealFromSlot = (day: Date, mealType: string) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    updateMealPlan(dayKey, mealType, null);
  };

  const getMealForSlot = (day: Date, mealType: string) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return getMealPlan(dayKey, mealType);
  };

  // Calculate total planned meals for the week
  const totalPlannedMeals = daysOfWeek.reduce((total, day) => {
    return total + mealTypes.reduce((dayTotal, mealType) => {
      return dayTotal + (getMealForSlot(day, mealType) ? 1 : 0);
    }, 0);
  }, 0);

  const completionPercentage = Math.round((totalPlannedMeals / (7 * 4)) * 100);

  // Calculate weekly nutrition totals
  const weeklyNutrition = daysOfWeek.reduce((total, day) => {
    const dayNutrition = mealTypes.reduce((dayTotal, mealType) => {
      const meal = getMealForSlot(day, mealType);
      if (meal) {
        return {
          calories: dayTotal.calories + meal.calories,
          protein: dayTotal.protein + meal.protein,
          carbs: dayTotal.carbs + meal.carbs,
          fat: dayTotal.fat + meal.fat
        };
      }
      return dayTotal;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      calories: total.calories + dayNutrition.calories,
      protein: total.protein + dayNutrition.protein,
      carbs: total.carbs + dayNutrition.carbs,
      fat: total.fat + dayNutrition.fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const weeklyGoals = {
    calories: personalizedGoals.calories * 7,
    protein: personalizedGoals.protein * 7,
    carbs: personalizedGoals.carbs * 7,
    fat: personalizedGoals.fat * 7
  };

  return (
    <div className="space-y-8 relative">
      {/* Background with grazing animals */}
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
        className="flex items-center justify-between relative z-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meal Planner</h1>
          <p className="text-secondary-400">Plan your week for consistent nutrition</p>
        </div>
        
        {/* Week Navigation */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handlePrevWeek}
            className="p-2 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-white hover:border-primary-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="px-6 py-3 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-center min-w-[250px]">
            <p className="text-white font-semibold">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </p>
            <p className="text-secondary-400 text-sm">Weekly Meal Plan</p>
          </div>
          
          <motion.button
            onClick={handleNextWeek}
            className="p-2 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-white hover:border-primary-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Improved Calendar Grid */}
      <div className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl overflow-hidden relative z-10">
        {/* Days Header */}
        <div className="grid grid-cols-8 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-b border-secondary-600">
          <div className="p-4 border-r border-secondary-600">
            <span className="text-secondary-300 text-sm font-medium">Meals</span>
          </div>
          {daysOfWeek.map((day, index) => (
            <motion.div 
              key={index} 
              className="p-4 text-center border-r border-secondary-600 last:border-r-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-white font-semibold">{format(day, 'EEE')}</p>
              <p className="text-primary-400 text-sm font-medium">{format(day, 'MMM d')}</p>
            </motion.div>
          ))}
        </div>

        {/* Meal Rows */}
        {mealTypes.map((mealType, mealIndex) => (
          <motion.div
            key={mealType}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: mealIndex * 0.1 }}
            className="grid grid-cols-8 border-b border-secondary-700 last:border-b-0"
          >
            <div className="p-4 bg-secondary-750/90 border-r border-secondary-600 flex items-center">
              <span className="text-white font-medium">{mealType}</span>
            </div>
            {daysOfWeek.map((day, dayIndex) => {
              const meal = getMealForSlot(day, mealType);
              
              return (
                <motion.div
                  key={dayIndex}
                  className="p-3 border-r border-secondary-600 last:border-r-0 min-h-[100px] hover:bg-secondary-750/50 transition-colors cursor-pointer group relative"
                  whileHover={{ scale: 1.01 }}
                >
                  {meal ? (
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h4 className="text-white text-sm font-medium mb-1 line-clamp-2">{meal.name}</h4>
                        <div className="space-y-1">
                          <p className="text-accent-400 text-xs font-medium">{meal.calories} cal</p>
                          <p className="text-primary-400 text-xs">{meal.protein}g protein</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-secondary-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{meal.cookTime}min</span>
                        </div>
                        <motion.button
                          onClick={() => removeMealFromSlot(day, mealType)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all rounded"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center">
                      <motion.div
                        className="w-full h-full border-2 border-dashed border-secondary-600 rounded-lg flex flex-col items-center justify-center group-hover:border-primary-500 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAddMealToSlot(day, mealType)}
                      >
                        <Plus className="w-5 h-5 text-secondary-500 group-hover:text-primary-400 mb-1" />
                        <span className="text-secondary-500 group-hover:text-primary-400 text-xs">Add meal</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Completion</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{completionPercentage}%</p>
          <p className="text-secondary-400 text-sm">{totalPlannedMeals} of 28 meals planned</p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
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
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Weekly Calories</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{weeklyNutrition.calories.toLocaleString()}</p>
          <p className="text-secondary-400 text-sm">Goal: {weeklyGoals.calories.toLocaleString()}</p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((weeklyNutrition.calories / weeklyGoals.calories) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Weekly Protein</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{weeklyNutrition.protein}g</p>
          <p className="text-secondary-400 text-sm">Goal: {weeklyGoals.protein}g</p>
          <div className="mt-3 bg-secondary-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((weeklyNutrition.protein / weeklyGoals.protein) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Daily Average</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{Math.round(weeklyNutrition.calories / 7)}</p>
          <p className="text-secondary-400 text-sm">calories per day</p>
        </motion.div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddMeal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Choose a Meal for {selectedSlot?.mealType} on {selectedSlot && format(selectedSlot.day, 'MMM d')}
              </h3>
              <button
                onClick={() => setShowAddMeal(false)}
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

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <motion.button
                onClick={() => setShowCreateCustomMeal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Meal</span>
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  className="bg-secondary-700 border border-secondary-600 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelectRecipe(recipe)}
                >
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-medium text-white mb-2">{recipe.name}</h4>
                  <div className="flex items-center space-x-4 text-secondary-400 text-sm mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-white font-semibold">{recipe.calories}</p>
                      <p className="text-secondary-400">cal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-primary-400 font-semibold">{recipe.protein}g</p>
                      <p className="text-secondary-400">protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-accent-400 font-semibold">{recipe.carbs}g</p>
                      <p className="text-secondary-400">carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-400 font-semibold">{recipe.fat}g</p>
                      <p className="text-secondary-400">fat</p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
            <NutritionEstimator
              onEstimationComplete={handleAIEstimation}
              onClose={() => setShowAIEstimator(false)}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Create Custom Meal Modal */}
      {showCreateCustomMeal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateCustomMeal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Custom Meal</h3>
              <button
                onClick={() => setShowCreateCustomMeal(false)}
                className="text-secondary-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Meal Name *
                </label>
                <input
                  type="text"
                  value={customMeal.name}
                  onChange={(e) => setCustomMeal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter meal name"
                  className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={customMeal.cookTime}
                    onChange={(e) => setCustomMeal(prev => ({ ...prev, cookTime: e.target.value }))}
                    placeholder="30"
                    className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    value={customMeal.servings}
                    onChange={(e) => setCustomMeal(prev => ({ ...prev, servings: e.target.value }))}
                    placeholder="1"
                    className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Nutrition Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Nutrition Information</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={customMeal.protein}
                      onChange={(e) => setCustomMeal(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="25"
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={customMeal.carbs}
                      onChange={(e) => setCustomMeal(prev => ({ ...prev, carbs: e.target.value }))}
                      placeholder="45"
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={customMeal.fat}
                      onChange={(e) => setCustomMeal(prev => ({ ...prev, fat: e.target.value }))}
                      placeholder="15"
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Calories
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={customMeal.calories}
                        onChange={(e) => setCustomMeal(prev => ({ ...prev, calories: e.target.value }))}
                        placeholder="400"
                        className="flex-1 px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                      <motion.button
                        onClick={calculateCaloriesFromMacros}
                        className="px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title="Calculate from macros"
                      >
                        Calc
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-secondary-700">
              <motion.button
                onClick={() => setShowCreateCustomMeal(false)}
                className="px-6 py-2 border border-secondary-600 text-secondary-300 rounded-lg hover:bg-secondary-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleCreateCustomMeal}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Plan
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MealPlannerPage;