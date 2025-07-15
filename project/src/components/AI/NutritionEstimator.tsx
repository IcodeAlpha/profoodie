import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Zap, Brain, Search, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

interface NutritionEstimatorProps {
  onEstimationComplete: (nutritionData: any) => void;
  onClose: () => void;
}

const NutritionEstimator: React.FC<NutritionEstimatorProps> = ({ onEstimationComplete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'description' | 'ingredients'>('photo');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [portion, setPortion] = useState('medium');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const tabs = [
    { id: 'photo', label: 'Photo Analysis', icon: Camera, description: 'Take or upload a photo of your food' },
    { id: 'description', label: 'Describe Food', icon: Brain, description: 'Describe what you ate in your own words' },
    { id: 'ingredients', label: 'List Ingredients', icon: Search, description: 'List ingredients from any cuisine' }
  ];

  const portionSizes = [
    { id: 'small', label: 'Small', description: 'Light portion', multiplier: 0.7 },
    { id: 'medium', label: 'Medium', description: 'Regular portion', multiplier: 1.0 },
    { id: 'large', label: 'Large', description: 'Generous portion', multiplier: 1.3 },
    { id: 'extra-large', label: 'Extra Large', description: 'Very large portion', multiplier: 1.6 }
  ];

  // Mock AI analysis - in production, this would call your AI service
  const analyzeFood = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let mockResult;
    
    if (activeTab === 'photo') {
      mockResult = {
        foodName: 'Mixed Global Cuisine Plate',
        confidence: 92,
        nutrition: {
          calories: 520,
          protein: 28,
          carbs: 45,
          fat: 22,
          fiber: 8,
          sodium: 680
        },
        ingredients: ['Grain-based staple', 'Leafy greens', 'Grilled protein', 'Onions', 'Tomatoes', 'Cooking oil'],
        culturalContext: 'Traditional meal with global appeal - excellent source of protein and complex carbohydrates',
        healthInsights: [
          'High in protein for muscle building',
          'Good source of iron from leafy greens',
          'Complex carbs provide sustained energy',
          'Consider adding more vegetables for fiber'
        ]
      };
    } else if (activeTab === 'description') {
      // Parse description for Kenyan foods
      const lowerDesc = description.toLowerCase();
      if (lowerDesc.includes('rice') || lowerDesc.includes('grain') || lowerDesc.includes('staple')) {
        mockResult = {
          foodName: 'Grain-based meal',
          confidence: 85,
          nutrition: {
            calories: 380,
            protein: 12,
            carbs: 68,
            fat: 8,
            fiber: 4,
            sodium: 420
          },
          ingredients: ['Grain flour', 'Water', 'Salt'],
          culturalContext: 'Staple food found globally - provides energy and sustenance',
          healthInsights: [
            'Good source of complex carbohydrates',
            'Often gluten-free depending on grain type',
            'Pair with protein and vegetables for balanced meal'
          ]
        };
      } else {
        mockResult = {
          foodName: 'Mixed meal',
          confidence: 78,
          nutrition: {
            calories: 450,
            protein: 20,
            carbs: 35,
            fat: 18,
            fiber: 6,
            sodium: 550
          },
          ingredients: ['Various ingredients'],
          culturalContext: 'Globally-inspired balanced meal with good macronutrient distribution',
          healthInsights: [
            'Well-balanced macronutrients',
            'Good protein content',
            'Consider portion size for your goals'
          ]
        };
      }
    } else {
      // Analyze ingredients list
      mockResult = {
        foodName: 'Custom recipe',
        confidence: 88,
        nutrition: {
          calories: 420,
          protein: 25,
          carbs: 40,
          fat: 15,
          fiber: 7,
          sodium: 480
        },
        ingredients: ingredients.split(',').map(i => i.trim()),
        culturalContext: 'Home-cooked meal with fresh ingredients',
        healthInsights: [
          'Fresh ingredients provide better nutrition',
          'Good balance of macronutrients',
          'Cooking method affects final nutrition'
        ]
      };
    }

    // Apply portion size multiplier
    const selectedPortion = portionSizes.find(p => p.id === portion);
    if (selectedPortion) {
      mockResult.nutrition = {
        ...mockResult.nutrition,
        calories: Math.round(mockResult.nutrition.calories * selectedPortion.multiplier),
        protein: Math.round(mockResult.nutrition.protein * selectedPortion.multiplier),
        carbs: Math.round(mockResult.nutrition.carbs * selectedPortion.multiplier),
        fat: Math.round(mockResult.nutrition.fat * selectedPortion.multiplier),
        fiber: Math.round(mockResult.nutrition.fiber * selectedPortion.multiplier),
        sodium: Math.round(mockResult.nutrition.sodium * selectedPortion.multiplier)
      };
    }

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const handleAcceptEstimation = () => {
    if (analysisResult) {
      onEstimationComplete({
        name: analysisResult.foodName,
        calories: analysisResult.nutrition.calories,
        protein: analysisResult.nutrition.protein,
        carbs: analysisResult.nutrition.carbs,
        fat: analysisResult.nutrition.fat,
        aiGenerated: true,
        confidence: analysisResult.confidence
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Smart Nutrition AI</h3>
        <p className="text-secondary-400">
          Don't know the nutrition info? Our AI provides accurate nutritional analysis!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-secondary-700/50 rounded-xl p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-secondary-300 hover:text-white hover:bg-secondary-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-secondary-700/50 rounded-xl p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-2">
            {tabs.find(t => t.id === activeTab)?.label}
          </h4>
          <p className="text-secondary-400 text-sm">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {activeTab === 'photo' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-secondary-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
              <Camera className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Take a photo or upload an image</p>
              <p className="text-secondary-400 text-sm mb-4">
                Our AI can recognize foods and provide accurate nutrition estimates
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </motion.button>
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-500 text-white rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'description' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                Describe your meal
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., I had ugali with sukuma wiki and a piece of grilled chicken. The ugali was about the size of my fist, and I had a good portion of vegetables..."
                rows={4}
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
              />
            </div>
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-primary-300 font-medium text-sm">AI Tip</p>
                  <p className="text-secondary-300 text-sm">
                    Be specific about portion sizes, cooking methods, and ingredients. 
                    Include cooking methods and portion sizes for better accuracy!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                List the main ingredients
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., pasta, tomatoes, garlic, olive oil, basil, parmesan cheese"
                rows={3}
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
              />
              <p className="text-secondary-400 text-xs mt-1">
                Separate ingredients with commas
              </p>
            </div>
          </div>
        )}

        {/* Portion Size Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-secondary-300 mb-3">
            Portion Size
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {portionSizes.map((size) => (
              <motion.button
                key={size.id}
                onClick={() => setPortion(size.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  portion === size.id
                    ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                    : 'border-secondary-600 bg-secondary-700/50 text-secondary-300 hover:border-secondary-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-medium text-sm">{size.label}</p>
                <p className="text-xs opacity-80">{size.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Button */}
      <motion.button
        onClick={analyzeFood}
        disabled={isAnalyzing || (activeTab === 'description' && !description.trim()) || (activeTab === 'ingredients' && !ingredients.trim())}
        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:from-secondary-600 disabled:to-secondary-600 text-white font-bold rounded-xl transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isAnalyzing ? (
          <>
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Analyzing with AI...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Analyze with AI</span>
          </>
        )}
      </motion.button>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary-700/50 rounded-xl p-6 border border-primary-500/30"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{analysisResult.foodName}</h4>
              <p className="text-secondary-400 text-sm">
                AI Confidence: {analysisResult.confidence}%
              </p>
            </div>
          </div>

          {/* Nutrition Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-400">{analysisResult.nutrition.calories}</p>
              <p className="text-secondary-400 text-sm">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-400">{analysisResult.nutrition.protein}g</p>
              <p className="text-secondary-400 text-sm">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{analysisResult.nutrition.carbs}g</p>
              <p className="text-secondary-400 text-sm">Carbs</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <h5 className="text-white font-medium mb-2">Cultural Context</h5>
              <p className="text-secondary-300 text-sm">{analysisResult.culturalContext}</p>
            </div>

            <div>
              <h5 className="text-white font-medium mb-2">Health Insights</h5>
              <ul className="space-y-1">
                {analysisResult.healthInsights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-secondary-300 text-sm">
                    <span className="text-primary-400 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <motion.button
              onClick={handleAcceptEstimation}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Use This Estimation
            </motion.button>
            <motion.button
              onClick={() => setAnalysisResult(null)}
              className="px-4 py-2 border border-secondary-600 text-secondary-300 rounded-lg hover:bg-secondary-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <p className="text-yellow-300 text-xs">
                AI estimations are approximate. For precise nutrition tracking, use verified food data when possible.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NutritionEstimator;