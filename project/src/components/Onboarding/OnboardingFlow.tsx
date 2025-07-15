import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Target, 
  Activity, 
  Scale,
  Sparkles,
  CheckCircle,
  Brain
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    preferredMeals: []
  });

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { id: 'very', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'extra', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  const goals = [
    { id: 'lose-weight', label: 'Lose Weight', description: 'Reduce body weight healthily', icon: '📉' },
    { id: 'gain-weight', label: 'Gain Weight', description: 'Build healthy mass', icon: '📈' },
    { id: 'maintain', label: 'Maintain Weight', description: 'Stay at current weight', icon: '⚖️' },
    { id: 'build-muscle', label: 'Build Muscle', description: 'Increase muscle mass', icon: '💪' },
    { id: 'improve-health', label: 'Improve Health', description: 'Better overall wellness', icon: '❤️' }
  ];

  const globalFoods = [
    { id: 'chicken', label: 'Chicken', emoji: '🍗' },
    { id: 'salmon', label: 'Salmon', emoji: '🐟' },
    { id: 'vegetables', label: 'Vegetables', emoji: '🥬' },
    { id: 'fruits', label: 'Fruits', emoji: '🍎' },
    { id: 'grains', label: 'Whole Grains', emoji: '🌾' },
    { id: 'nuts', label: 'Nuts & Seeds', emoji: '🥜' },
    { id: 'dairy', label: 'Dairy', emoji: '🥛' },
    { id: 'legumes', label: 'Legumes', emoji: '🫘' }
  ];

  const updateUserData = (field: string, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? (prev[field as keyof typeof prev] as string[]).filter((i: string) => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item]
    }));
  };

  const canProceed = () => {
    return userData.name && userData.age && userData.gender && userData.height && 
           userData.weight && userData.activityLevel && userData.goal;
  };

  const handleComplete = () => {
    if (canProceed()) {
      onComplete(userData);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to proFoodie!</h1>
          <p className="text-secondary-400 text-lg">
            Let's set up your personalized nutrition profile with AI-powered recommendations
          </p>
        </motion.div>

        {/* Single Page Form */}
        <motion.div
          className="bg-secondary-800 rounded-2xl p-8 border border-secondary-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-400" />
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => updateUserData('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={userData.age}
                        onChange={(e) => updateUserData('age', e.target.value)}
                        placeholder="25"
                        className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={userData.gender}
                        onChange={(e) => updateUserData('gender', e.target.value)}
                        className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white focus:border-primary-500 focus:outline-none"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={userData.height}
                        onChange={(e) => updateUserData('height', e.target.value)}
                        placeholder="170"
                        className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={userData.weight}
                        onChange={(e) => updateUserData('weight', e.target.value)}
                        placeholder="70"
                        className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary-400" />
                  Activity Level
                </h3>
                <div className="space-y-3">
                  {activityLevels.map((level) => (
                    <motion.div
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        userData.activityLevel === level.id
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-secondary-600 bg-secondary-700/50 hover:border-secondary-500'
                      }`}
                      onClick={() => updateUserData('activityLevel', level.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white text-sm">{level.label}</h4>
                          <p className="text-secondary-400 text-xs">{level.description}</p>
                        </div>
                        {userData.activityLevel === level.id && (
                          <CheckCircle className="w-5 h-5 text-primary-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Goals & Preferences */}
            <div className="space-y-6">
              {/* Health Goals */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary-400" />
                  Health Goals
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {goals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        userData.goal === goal.id
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-secondary-600 bg-secondary-700/50 hover:border-secondary-500'
                      }`}
                      onClick={() => updateUserData('goal', goal.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{goal.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{goal.label}</h4>
                          <p className="text-secondary-400 text-sm">{goal.description}</p>
                        </div>
                        {userData.goal === goal.id && (
                          <CheckCircle className="w-5 h-5 text-primary-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Food Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Scale className="w-5 h-5 mr-2 text-primary-400" />
                  Food Preferences (Optional)
                </h3>
                <p className="text-secondary-400 text-sm mb-4">
                  Select foods you enjoy to get better recommendations
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {globalFoods.map((food) => (
                    <motion.div
                      key={food.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        userData.preferredMeals.includes(food.id)
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-secondary-600 bg-secondary-700/50 hover:border-secondary-500'
                      }`}
                      onClick={() => toggleArrayItem('preferredMeals', food.id)}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{food.emoji}</div>
                        <p className="text-white text-sm font-medium">{food.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Info */}
              <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-primary-400 mt-0.5" />
                  <div>
                    <h4 className="text-primary-300 font-medium mb-1">AI-Powered Personalization</h4>
                    <p className="text-secondary-300 text-sm">
                      Our AI will calculate your personalized nutrition goals based on your profile, 
                      using scientific formulas and metabolic factors for optimal health outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <div className="mt-8 pt-6 border-t border-secondary-700">
            <motion.button
              onClick={handleComplete}
              disabled={!canProceed()}
              className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white'
                  : 'bg-secondary-700 text-secondary-500 cursor-not-allowed'
              }`}
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              <Sparkles className="w-5 h-5" />
              <span>Complete Setup & Start Your Health Journey</span>
            </motion.button>
            
            {!canProceed() && (
              <p className="text-secondary-400 text-sm text-center mt-2">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingFlow;