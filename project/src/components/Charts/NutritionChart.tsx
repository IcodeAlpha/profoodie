import React from 'react';
import { motion } from 'framer-motion';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionChartProps {
  data: NutritionData;
  goals: NutritionData;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ data, goals }) => {
  const macros = [
    {
      name: 'Protein',
      current: data.protein,
      goal: goals.protein,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500'
    },
    {
      name: 'Carbs',
      current: data.carbs,
      goal: goals.carbs,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500'
    },
    {
      name: 'Fat',
      current: data.fat,
      goal: goals.fat,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Calories Progress Circle */}
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
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
              className="text-primary-500"
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 40 * (1 - Math.min(data.calories / goals.calories, 1))
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{data.calories}</p>
              <p className="text-xs text-secondary-400">of {goals.calories}</p>
            </div>
          </div>
        </div>
        <p className="text-secondary-400 text-sm">Daily Calories</p>
      </div>

      {/* Macros Progress Bars */}
      <div className="space-y-4">
        {macros.map((macro, index) => (
          <motion.div
            key={macro.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-medium">{macro.name}</span>
              <span className="text-secondary-400">{macro.current}g / {macro.goal}g</span>
            </div>
            <div className="bg-secondary-700 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full ${macro.bgColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((macro.current / macro.goal) * 100, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NutritionChart;