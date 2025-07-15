import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, ChefHat, Heart, Share2, Printer as Print, Star, Plus, Minus, Timer, Flame, Zap, Target, CheckCircle, AlertCircle, BookOpen, Utensils, Globe } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  cookTime: number;
  servings: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
  tags?: string[];
  description?: string;
  tips?: string[];
  nutrition?: {
    fiber?: number;
    sodium?: number;
    sugar?: number;
    calcium?: number;
    iron?: number;
    vitaminC?: number;
  };
}

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onSave?: (recipe: Recipe) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ 
  recipe, 
  isOpen, 
  onClose, 
  onAddToMealPlan,
  onSave 
}) => {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'instructions' | 'nutrition' | 'tips'>('overview');
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(new Array(recipe.ingredients.length).fill(false));
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(recipe.instructions.length).fill(false));
  const [isFavorited, setIsFavorited] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const servingMultiplier = servings / recipe.servings;

  const adjustedNutrition = {
    calories: Math.round(recipe.calories * servingMultiplier),
    protein: Math.round(recipe.protein * servingMultiplier),
    carbs: Math.round(recipe.carbs * servingMultiplier),
    fat: Math.round(recipe.fat * servingMultiplier),
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'ingredients', label: 'Ingredients', icon: Utensils },
    { id: 'instructions', label: 'Instructions', icon: ChefHat },
    { id: 'nutrition', label: 'Nutrition', icon: Target },
    { id: 'tips', label: 'Tips', icon: Star }
  ];

  const toggleIngredient = (index: number) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
  };

  const toggleStep = (index: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[index] = !newCompleted[index];
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-secondary-400 bg-secondary-500/20';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-secondary-800 border border-secondary-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            {recipe.image ? (
              <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${recipe.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-primary-500 to-accent-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefHat className="w-24 h-24 text-white/30" />
                </div>
              </div>
            )}
            
            {/* Header Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
                  {recipe.description && (
                    <p className="text-white/90 mb-4 max-w-2xl">{recipe.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(recipe.cookTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{servings} servings</span>
                    </div>
                    {recipe.difficulty && (
                      <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                        <ChefHat className="w-3 h-3" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    )}
                    {recipe.cuisine && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>{recipe.cuisine}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorited ? 'bg-red-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    className="p-3 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    className="p-3 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Print className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-3 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-[calc(90vh-16rem)]">
            {/* Tabs */}
            <div className="flex border-b border-secondary-700 bg-secondary-800">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400 bg-secondary-750'
                      : 'text-secondary-400 hover:text-white hover:bg-secondary-750'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary-700/50 rounded-xl p-4 text-center">
                      <Flame className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{adjustedNutrition.calories}</p>
                      <p className="text-secondary-400 text-sm">Calories</p>
                    </div>
                    <div className="bg-secondary-700/50 rounded-xl p-4 text-center">
                      <Zap className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{adjustedNutrition.protein}g</p>
                      <p className="text-secondary-400 text-sm">Protein</p>
                    </div>
                    <div className="bg-secondary-700/50 rounded-xl p-4 text-center">
                      <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{adjustedNutrition.carbs}g</p>
                      <p className="text-secondary-400 text-sm">Carbs</p>
                    </div>
                    <div className="bg-secondary-700/50 rounded-xl p-4 text-center">
                      <Heart className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{adjustedNutrition.fat}g</p>
                      <p className="text-secondary-400 text-sm">Fat</p>
                    </div>
                  </div>

                  {/* Servings Adjuster */}
                  <div className="bg-secondary-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Adjust Servings</h3>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        className="w-10 h-10 bg-secondary-600 hover:bg-secondary-500 text-white rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{servings}</p>
                        <p className="text-secondary-400 text-sm">servings</p>
                      </div>
                      
                      <motion.button
                        onClick={() => setServings(servings + 1)}
                        className="w-10 h-10 bg-secondary-600 hover:bg-secondary-500 text-white rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    {onAddToMealPlan && (
                      <motion.button
                        onClick={() => onAddToMealPlan(recipe)}
                        className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add to Meal Plan
                      </motion.button>
                    )}
                    
                    <motion.button
                      onClick={() => setCookingMode(true)}
                      className="flex-1 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Cooking
                    </motion.button>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Ingredients</h3>
                    <p className="text-secondary-400 text-sm">For {servings} servings</p>
                  </div>
                  
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                          checkedIngredients[index] 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-secondary-700/50 hover:bg-secondary-700'
                        }`}
                        onClick={() => toggleIngredient(index)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          checkedIngredients[index] 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-secondary-500'
                        }`}>
                          {checkedIngredients[index] && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`flex-1 ${
                          checkedIngredients[index] 
                            ? 'text-green-300 line-through' 
                            : 'text-white'
                        }`}>
                          {ingredient}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Instructions</h3>
                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-400 text-sm">~{formatTime(recipe.cookTime)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        className={`flex space-x-4 p-4 rounded-lg transition-colors cursor-pointer ${
                          completedSteps[index] 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-secondary-700/50 hover:bg-secondary-700'
                        }`}
                        onClick={() => toggleStep(index)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          completedSteps[index] 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-secondary-500'
                        }`}>
                          {completedSteps[index] ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-secondary-400 font-medium">{index + 1}</span>
                          )}
                        </div>
                        <p className={`flex-1 leading-relaxed ${
                          completedSteps[index] 
                            ? 'text-green-300 line-through' 
                            : 'text-white'
                        }`}>
                          {instruction}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Nutrition Facts</h3>
                  
                  {/* Main Macros */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary-700/50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Flame className="w-6 h-6 text-accent-400" />
                        <h4 className="font-semibold text-white">Calories</h4>
                      </div>
                      <p className="text-3xl font-bold text-accent-400">{adjustedNutrition.calories}</p>
                      <p className="text-secondary-400 text-sm">per serving</p>
                    </div>
                    
                    <div className="bg-secondary-700/50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Zap className="w-6 h-6 text-primary-400" />
                        <h4 className="font-semibold text-white">Protein</h4>
                      </div>
                      <p className="text-3xl font-bold text-primary-400">{adjustedNutrition.protein}g</p>
                      <p className="text-secondary-400 text-sm">per serving</p>
                    </div>
                    
                    <div className="bg-secondary-700/50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Target className="w-6 h-6 text-blue-400" />
                        <h4 className="font-semibold text-white">Carbs</h4>
                      </div>
                      <p className="text-3xl font-bold text-blue-400">{adjustedNutrition.carbs}g</p>
                      <p className="text-secondary-400 text-sm">per serving</p>
                    </div>
                  </div>

                  {/* Detailed Nutrition */}
                  {recipe.nutrition && (
                    <div className="bg-secondary-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-4">Detailed Nutrition</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {recipe.nutrition.fiber && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-400">{Math.round(recipe.nutrition.fiber * servingMultiplier)}g</p>
                            <p className="text-secondary-400 text-sm">Fiber</p>
                          </div>
                        )}
                        {recipe.nutrition.sodium && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-red-400">{Math.round(recipe.nutrition.sodium * servingMultiplier)}mg</p>
                            <p className="text-secondary-400 text-sm">Sodium</p>
                          </div>
                        )}
                        {recipe.nutrition.sugar && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-400">{Math.round(recipe.nutrition.sugar * servingMultiplier)}g</p>
                            <p className="text-secondary-400 text-sm">Sugar</p>
                          </div>
                        )}
                        {recipe.nutrition.calcium && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-400">{Math.round(recipe.nutrition.calcium * servingMultiplier)}mg</p>
                            <p className="text-secondary-400 text-sm">Calcium</p>
                          </div>
                        )}
                        {recipe.nutrition.iron && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-orange-400">{Math.round(recipe.nutrition.iron * servingMultiplier)}mg</p>
                            <p className="text-secondary-400 text-sm">Iron</p>
                          </div>
                        )}
                        {recipe.nutrition.vitaminC && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-yellow-400">{Math.round(recipe.nutrition.vitaminC * servingMultiplier)}mg</p>
                            <p className="text-secondary-400 text-sm">Vitamin C</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Cooking Tips & Notes</h3>
                  
                  {recipe.tips && recipe.tips.length > 0 ? (
                    <div className="space-y-4">
                      {recipe.tips.map((tip, index) => (
                        <div key={index} className="bg-secondary-700/50 rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <Star className="w-5 h-5 text-accent-400 mt-0.5" />
                            <p className="text-white leading-relaxed">{tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
                      <p className="text-secondary-400">No cooking tips available for this recipe.</p>
                    </div>
                  )}

                  {/* General Tips */}
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
                    <h4 className="font-semibold text-primary-300 mb-3">General Cooking Tips</h4>
                    <ul className="space-y-2 text-secondary-300 text-sm">
                      <li>• Read through the entire recipe before starting</li>
                      <li>• Prep all ingredients before you begin cooking</li>
                      <li>• Taste and adjust seasoning as you go</li>
                      <li>• Use fresh ingredients when possible for best flavor</li>
                      <li>• Don't be afraid to make substitutions based on your preferences</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeModal;