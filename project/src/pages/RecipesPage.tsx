import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Users, Flame, Plus, Heart, X, ChefHat, Star, Globe } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import RecipeModal from '../components/Recipes/RecipeModal';

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

const RecipesPage: React.FC = () => {
  const { recipes, addRecipe, addMeal, updateMealPlan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    cookTime: '',
    servings: '',
    image: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    cuisine: '',
    tags: '',
    tips: ['']
  });

  const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'healthy', label: 'Healthy' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'italian', label: 'Italian' },
    { id: 'protein', label: 'High Protein' },
    { id: 'quick', label: 'Quick Meals' }
  ];

  // Enhanced recipes with full details
  const enhancedRecipes: Recipe[] = recipes.map(recipe => ({
    ...recipe,
    difficulty: ['1', '4', '6'].includes(recipe.id) ? 'Easy' : 
               ['2', '5'].includes(recipe.id) ? 'Medium' : 'Hard',
    cuisine: ['1', '2', '3', '6'].includes(recipe.id) ? 'Healthy' :
             recipe.id === '4' ? 'Chinese' :
             recipe.id === '5' ? 'Italian' : 'International',
    description: recipe.id === '1' 
      ? 'A nutritious grain bowl combining healthy grains with flavorful greens. Perfect comfort food that\'s both filling and healthy.'
      : recipe.id === '2'
      ? 'Tender, slow-cooked beef stew with vegetables. A hearty meal that brings families together around the dinner table.'
      : recipe.id === '3'
      ? 'A nutritious mix of grains and beans, enhanced with fresh vegetables. A complete protein source that\'s both delicious and affordable.'
      : recipe.id === '4'
      ? 'Soft, homemade chapati served with a colorful vegetable curry. A versatile meal that can be enjoyed any time of day.'
      : recipe.id === '5'
      ? 'Classic Chinese fried rice with tender chicken and fresh vegetables. A complete meal that\'s quick and satisfying.'
      : recipe.id === '6'
      ? 'Traditional Chinese dish with crispy pork in a tangy sweet and sour sauce. Perfect balance of flavors and textures.'
      : recipe.id === '7'
      ? 'Authentic Italian pasta with a creamy egg and cheese sauce. Simple ingredients create an incredibly rich and satisfying dish.'
      : 'Grilled salmon with quinoa and vegetables. A perfect balance of omega-3s, protein, and complex carbs.',
    tags: recipe.id === '1' 
      ? ['Nutritious', 'Vegetarian', 'Gluten-Free', 'High-Fiber']
      : recipe.id === '2'
      ? ['Nutritious', 'High-Protein', 'Comfort Food', 'Family Meal']
      : recipe.id === '3'
      ? ['Nutritious', 'Vegetarian', 'High-Protein', 'Budget-Friendly']
      : recipe.id === '4'
      ? ['Traditional', 'Vegetarian', 'Comfort Food']
      : recipe.id === '5'
      ? ['Chinese', 'One-Pot', 'Quick', 'High-Protein']
      : ['Healthy', 'High-Protein', 'Omega-3', 'Balanced'],
    tips: recipe.id === '1'
      ? [
          'Stir grains continuously to avoid lumps',
          'Add green stems first, then leaves for perfect texture',
          'Season the greens well with onions and tomatoes',
          'Serve immediately while hot for best taste'
        ]
      : recipe.id === '2'
      ? [
          'Brown the meat well for deeper flavor',
          'Cut vegetables into uniform sizes for even cooking',
          'Simmer on low heat for tender, fall-apart meat',
          'Add potatoes in the last 30 minutes to prevent overcooking'
        ]
      : recipe.id === '3'
      ? [
          'Soak beans overnight for faster cooking',
          'Cook grains and beans separately first, then combine',
          'Add vegetables in stages based on cooking time',
          'Fresh coriander adds a wonderful finishing touch'
        ]
      : recipe.id === '4'
      ? [
          'Use day-old rice for best texture',
          'Keep the heat high for proper wok hei flavor',
          'Add ingredients in order of cooking time',
          'Don\'t overcrowd the pan'
        ]
      : recipe.id === '5'
      ? [
          'Use room temperature eggs for smooth sauce',
          'Work quickly when adding egg mixture',
          'Save some pasta water for adjusting consistency',
          'Serve immediately for best results'
        ]
      : [
          'Don\'t overcook salmon to keep it moist',
          'Let quinoa rest after cooking for fluffiness',
          'Season vegetables lightly to preserve nutrients',
          'Serve immediately for best flavor'
        ],
    nutrition: recipe.id === '1'
      ? { fiber: 8, sodium: 420, iron: 3.2, vitaminC: 45, calcium: 120 }
      : recipe.id === '2'
      ? { fiber: 4, sodium: 680, iron: 4.8, vitaminC: 25, calcium: 80 }
      : recipe.id === '3'
      ? { fiber: 12, sodium: 380, iron: 5.2, vitaminC: 35, calcium: 95 }
      : recipe.id === '4'
      ? { fiber: 6, sodium: 520, iron: 2.8, vitaminC: 40, calcium: 110 }
      : recipe.id === '5'
      ? { fiber: 3, sodium: 650, iron: 2.2, vitaminC: 5, calcium: 180 }
      : { fiber: 4, sodium: 320, iron: 2.8, vitaminC: 25, calcium: 85 }
  }));

  const filteredRecipes = enhancedRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || 
     (selectedCategory === 'healthy' && recipe.cuisine === 'Healthy') ||
     (selectedCategory === 'chinese' && recipe.cuisine === 'Chinese') ||
     (selectedCategory === 'italian' && recipe.cuisine === 'Italian') ||
     (selectedCategory === 'protein' && recipe.protein >= 25) ||
     (selectedCategory === 'quick' && recipe.cookTime <= 30))
  );

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleAddToMealPlan = (recipe: Recipe) => {
    // For now, just add to today's lunch - in a real app, you'd let user choose
    const today = new Date().toISOString().split('T')[0];
    updateMealPlan(today, 'lunch', recipe);
    
    // Also add to daily tracker
    addMeal({
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      time: 'lunch',
      date: today
    });
  };

  const handleAddIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? value : ingredient
      )
    }));
  };

  const handleAddInstruction = () => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleRemoveInstruction = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) => 
        i === index ? value : instruction
      )
    }));
  };

  const handleAddTip = () => {
    setNewRecipe(prev => ({
      ...prev,
      tips: [...prev.tips, '']
    }));
  };

  const handleRemoveTip = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  const handleTipChange = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => 
        i === index ? value : tip
      )
    }));
  };

  const calculateCaloriesFromMacros = () => {
    const protein = parseInt(newRecipe.protein) || 0;
    const carbs = parseInt(newRecipe.carbs) || 0;
    const fat = parseInt(newRecipe.fat) || 0;
    
    // Calories calculation: Protein = 4 cal/g, Carbs = 4 cal/g, Fat = 9 cal/g
    const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
    
    setNewRecipe(prev => ({
      ...prev,
      calories: calculatedCalories.toString()
    }));
  };

  const handleCreateRecipe = () => {
    if (newRecipe.name && newRecipe.calories) {
      const filteredIngredients = newRecipe.ingredients.filter(ing => ing.trim() !== '');
      const filteredInstructions = newRecipe.instructions.filter(inst => inst.trim() !== '');
      const filteredTips = newRecipe.tips.filter(tip => tip.trim() !== '');
      const tagsArray = newRecipe.tags ? newRecipe.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      const recipeToAdd: Omit<Recipe, 'id'> = {
        name: newRecipe.name,
        description: newRecipe.description,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        calories: parseInt(newRecipe.calories),
        protein: parseInt(newRecipe.protein) || 0,
        carbs: parseInt(newRecipe.carbs) || 0,
        fat: parseInt(newRecipe.fat) || 0,
        cookTime: parseInt(newRecipe.cookTime) || 30,
        servings: parseInt(newRecipe.servings) || 1,
        image: newRecipe.image || undefined,
        difficulty: newRecipe.difficulty,
        cuisine: newRecipe.cuisine || 'Custom',
        tags: tagsArray,
        tips: filteredTips.length > 0 ? filteredTips : undefined
      };

      addRecipe(recipeToAdd);

      // Reset form
      setNewRecipe({
        name: '',
        description: '',
        ingredients: [''],
        instructions: [''],
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        cookTime: '',
        servings: '',
        image: '',
        difficulty: 'Easy',
        cuisine: '',
        tags: '',
        tips: ['']
      });
      setShowCreateRecipe(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-secondary-400 bg-secondary-500/20';
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Background with Kenyan spice market */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Recipe Collection</h1>
          <p className="text-secondary-400">Discover delicious and nutritious meals with complete cooking guides</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              className="pl-10 pr-4 py-2 bg-secondary-700/90 backdrop-blur-sm border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none w-64"
            />
          </div>
          <motion.button
            onClick={() => setShowCreateRecipe(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Recipe</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 relative z-10"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-700/90 backdrop-blur-sm text-secondary-300 hover:text-white hover:bg-secondary-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-700 rounded-xl overflow-hidden hover:border-primary-500 transition-colors group"
            whileHover={{ y: -5 }}
          >
            <div className="relative h-48 bg-secondary-700">
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ChefHat className="w-8 h-8 text-primary-400" />
                    </div>
                    <p className="text-secondary-400 text-sm">No image</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <motion.button
                  className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Difficulty Badge */}
              {recipe.difficulty && (
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                  {recipe.name}
                </h3>
                {recipe.cuisine && (
                  <div className="flex items-center space-x-1 ml-2">
                    <Globe className="w-3 h-3 text-secondary-400" />
                    <span className="text-secondary-400 text-xs">{recipe.cuisine}</span>
                  </div>
                )}
              </div>
              
              {recipe.description && (
                <p className="text-secondary-400 text-sm mb-3 line-clamp-2">{recipe.description}</p>
              )}
              
              <div className="flex items-center space-x-4 mb-4 text-secondary-400 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span>{recipe.calories} cal</span>
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="px-2 py-1 bg-secondary-600 text-secondary-300 rounded text-xs">
                      +{recipe.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-primary-400 font-semibold">{recipe.protein}g</p>
                  <p className="text-secondary-400 text-xs">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-accent-400 font-semibold">{recipe.carbs}g</p>
                  <p className="text-secondary-400 text-xs">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 font-semibold">{recipe.fat}g</p>
                  <p className="text-secondary-400 text-xs">Fat</p>
                </div>
              </div>

              <motion.button
                onClick={() => handleViewRecipe(recipe)}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Full Recipe
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 relative z-10"
        >
          <div className="w-16 h-16 bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
          <p className="text-secondary-400 mb-6">Try adjusting your search or create a new recipe</p>
          <motion.button
            onClick={() => setShowCreateRecipe(true)}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your First Recipe
          </motion.button>
        </motion.div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={showRecipeModal}
          onClose={() => {
            setShowRecipeModal(false);
            setSelectedRecipe(null);
          }}
          onAddToMealPlan={handleAddToMealPlan}
        />
      )}

      {/* Create Recipe Modal */}
      {showCreateRecipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateRecipe(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Create New Recipe</h3>
              <button
                onClick={() => setShowCreateRecipe(false)}
                className="text-secondary-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter recipe name"
                    className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the recipe"
                    rows={3}
                    className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Cook Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={newRecipe.cookTime}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: e.target.value }))}
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
                      value={newRecipe.servings}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: e.target.value }))}
                      placeholder="4"
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newRecipe.difficulty}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' }))}
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Cuisine
                    </label>
                    <input
                      type="text"
                      value={newRecipe.cuisine}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, cuisine: e.target.value }))}
                      placeholder="e.g., Kenyan, Italian"
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newRecipe.tags}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., Traditional, Vegetarian, High-Protein"
                    className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newRecipe.image}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-secondary-300">
                      Ingredients
                    </label>
                    <motion.button
                      onClick={handleAddIngredient}
                      className="flex items-center space-x-1 px-2 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </motion.button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                          placeholder={`Ingredient ${index + 1}`}
                          className="flex-1 px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        />
                        {newRecipe.ingredients.length > 1 && (
                          <motion.button
                            onClick={() => handleRemoveIngredient(index)}
                            className="p-2 text-red-400 hover:text-red-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nutrition & Instructions */}
              <div className="space-y-6">
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
                        value={newRecipe.protein}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, protein: e.target.value }))}
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
                        value={newRecipe.carbs}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, carbs: e.target.value }))}
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
                        value={newRecipe.fat}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, fat: e.target.value }))}
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
                          value={newRecipe.calories}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, calories: e.target.value }))}
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

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-secondary-300">
                      Instructions
                    </label>
                    <motion.button
                      onClick={handleAddInstruction}
                      className="flex items-center space-x-1 px-2 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </motion.button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {newRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-primary-400 font-medium mt-2 text-sm">{index + 1}.</span>
                        <textarea
                          value={instruction}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                          rows={2}
                          className="flex-1 px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                        />
                        {newRecipe.instructions.length > 1 && (
                          <motion.button
                            onClick={() => handleRemoveInstruction(index)}
                            className="p-2 text-red-400 hover:text-red-300 mt-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooking Tips */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-secondary-300">
                      Cooking Tips (optional)
                    </label>
                    <motion.button
                      onClick={handleAddTip}
                      className="flex items-center space-x-1 px-2 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Tip</span>
                    </motion.button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newRecipe.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Star className="w-4 h-4 text-accent-400 mt-2" />
                        <textarea
                          value={tip}
                          onChange={(e) => handleTipChange(index, e.target.value)}
                          placeholder={`Cooking tip ${index + 1}`}
                          rows={2}
                          className="flex-1 px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                        />
                        {newRecipe.tips.length > 1 && (
                          <motion.button
                            onClick={() => handleRemoveTip(index)}
                            className="p-2 text-red-400 hover:text-red-300 mt-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-secondary-700">
              <motion.button
                onClick={() => setShowCreateRecipe(false)}
                className="px-6 py-2 border border-secondary-600 text-secondary-300 rounded-lg hover:bg-secondary-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleCreateRecipe}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Recipe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipesPage;