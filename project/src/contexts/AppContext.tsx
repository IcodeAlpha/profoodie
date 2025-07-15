import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  date: string;
}

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
}

interface MealPlan {
  [date: string]: {
    [mealType: string]: Recipe;
  };
}

interface PersonalizedGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number; // in liters
}

interface AppContextType {
  meals: Meal[];
  recipes: Recipe[];
  mealPlan: MealPlan;
  personalizedGoals: PersonalizedGoals;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  removeMeal: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  removeRecipe: (id: string) => void;
  updateMealPlan: (date: string, mealType: string, recipe: Recipe | null) => void;
  getMealPlan: (date: string, mealType: string) => Recipe | null;
  dailyNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  calculatePersonalizedGoals: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [personalizedGoals, setPersonalizedGoals] = useState<PersonalizedGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
    water: 2.5
  });
  
  const [recipes, setRecipes] = useState<Recipe[]>([
    // Essential Healthy Recipes
    {
      id: '1',
      name: 'Grain Bowl with Greens',
      ingredients: [
        '2 cups grain flour',
        '3 cups water',
        '1 tsp salt',
        '1 bunch collard greens, chopped',
        '2 medium onions, diced',
        '3 tomatoes, chopped',
        '3 tbsp cooking oil',
        '2 cloves garlic, minced',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Bring 3 cups of water to boil in a heavy-bottomed pot. Add salt.',
        'Gradually add grain flour while stirring continuously to prevent lumps.',
        'Reduce heat to medium and continue stirring for 10-15 minutes until mixture pulls away from sides.',
        'Cover and let it cook for 5 more minutes. Remove from heat.',
        'Heat oil in a large pan over medium heat. Add onions and garlic, cook until soft.',
        'Add tomatoes and cook until they break down into a sauce (5-7 minutes).',
        'Add chopped greens, season with salt and pepper. Cook for 8-10 minutes until tender.',
        'Serve hot with the greens on the side.'
      ],
      calories: 450,
      protein: 12,
      carbs: 65,
      fat: 8,
      cookTime: 25,
      servings: 2,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      cuisine: 'Healthy',
      tags: ['Nutritious', 'Vegetarian', 'Gluten-Free', 'High-Fiber']
    },
    {
      id: '2',
      name: 'Spiced Beef Stew',
      ingredients: [
        '1 kg beef chuck, cut into chunks',
        '4 medium potatoes, cubed',
        '3 large carrots, sliced',
        '2 large onions, chopped',
        '4 tomatoes, chopped',
        '3 tbsp vegetable oil',
        '2 tsp curry powder',
        '1 tsp cumin',
        '1 tsp coriander seeds, ground',
        '3 cloves garlic, minced',
        '1 inch ginger, grated',
        '2 bay leaves',
        '3 cups beef stock',
        'Salt and black pepper to taste',
        'Fresh coriander for garnish'
      ],
      instructions: [
        'Heat oil in a large heavy pot over medium-high heat.',
        'Season beef with salt and pepper, then brown on all sides (8-10 minutes). Remove and set aside.',
        'In the same pot, add onions and cook until golden (5 minutes).',
        'Add garlic, ginger, curry powder, cumin, and ground coriander. Cook for 1 minute until fragrant.',
        'Add tomatoes and cook until they break down (5-7 minutes).',
        'Return beef to pot, add bay leaves and beef stock. Bring to boil.',
        'Reduce heat to low, cover and simmer for 1 hour.',
        'Add potatoes and carrots, continue cooking for 30-40 minutes until vegetables are tender.',
        'Adjust seasoning and garnish with fresh coriander before serving.'
      ],
      calories: 380,
      protein: 28,
      carbs: 22,
      fat: 18,
      cookTime: 45,
      servings: 4,
      image: 'https://images.pexels.com/photos/1860208/pexels-photo-1860208.jpeg',
      cuisine: 'Healthy',
      tags: ['Nutritious', 'High-Protein', 'Comfort Food', 'Family Meal']
    },
    {
      id: '3',
      name: 'Grain & Bean Bowl',
      ingredients: [
        '1 cup dried grain kernels (or 2 cups fresh/frozen)',
        '1 cup dried kidney beans',
        '2 large carrots, diced',
        '2 medium onions, chopped',
        '3 tomatoes, chopped',
        '3 tbsp vegetable oil',
        '2 cloves garlic, minced',
        '1 tsp cumin',
        '1 green bell pepper, chopped',
        '4 cups water or vegetable stock',
        'Salt and pepper to taste',
        'Fresh coriander, chopped',
        '1 tsp paprika (optional)'
      ],
      instructions: [
        'If using dried grains and beans, soak them separately overnight.',
        'Boil grains and beans separately until tender (45-60 minutes each). Drain and set aside.',
        'Heat oil in a large pot over medium heat. Add onions and cook until soft.',
        'Add garlic, cumin, and paprika. Cook for 1 minute until fragrant.',
        'Add tomatoes and bell pepper, cook until tomatoes break down (5-7 minutes).',
        'Add cooked grains and beans to the pot with carrots.',
        'Add enough stock to barely cover ingredients. Bring to boil.',
        'Reduce heat and simmer for 20-25 minutes until carrots are tender.',
        'Season with salt and pepper, garnish with fresh coriander before serving.'
      ],
      calories: 320,
      protein: 15,
      carbs: 58,
      fat: 4,
      cookTime: 60,
      servings: 3,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    },
    {
      id: '4',
      name: 'Chicken Fried Rice',
      ingredients: [
        '2 cups cooked jasmine rice (preferably day-old)',
        '300g chicken breast, diced',
        '3 eggs, beaten',
        '1 cup mixed vegetables (peas, carrots, corn)',
        '3 spring onions, chopped',
        '3 cloves garlic, minced',
        '2 tbsp soy sauce',
        '1 tbsp oyster sauce',
        '1 tsp sesame oil',
        '3 tbsp vegetable oil',
        'Salt and white pepper to taste'
      ],
      instructions: [
        'Heat 1 tbsp oil in a large wok or pan over high heat.',
        'Add beaten eggs and scramble quickly. Remove and set aside.',
        'Add remaining oil, then add chicken and cook until golden (5-6 minutes).',
        'Add garlic and mixed vegetables, stir-fry for 2-3 minutes.',
        'Add rice, breaking up any clumps, and stir-fry for 3-4 minutes.',
        'Add soy sauce, oyster sauce, and sesame oil. Mix well.',
        'Return scrambled eggs to the pan and add spring onions.',
        'Season with salt and pepper, serve immediately.'
      ],
      calories: 420,
      protein: 28,
      carbs: 45,
      fat: 12,
      cookTime: 20,
      servings: 4,
      image: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg'
    },
    {
      id: '5',
      name: 'Spaghetti Carbonara',
      ingredients: [
        '400g spaghetti',
        '200g pancetta or bacon, diced',
        '4 large eggs',
        '100g Parmesan cheese, grated',
        '3 cloves garlic, minced',
        '2 tbsp olive oil',
        'Black pepper to taste',
        'Salt for pasta water'
      ],
      instructions: [
        'Cook spaghetti in salted boiling water until al dente.',
        'Meanwhile, heat olive oil and cook pancetta until crispy.',
        'Add garlic and cook for 1 minute.',
        'In a bowl, whisk eggs with Parmesan and black pepper.',
        'Drain pasta, reserving 1 cup pasta water.',
        'Add hot pasta to pancetta pan, remove from heat.',
        'Quickly add egg mixture, tossing constantly to create creamy sauce.',
        'Add pasta water if needed. Serve immediately with extra Parmesan.'
      ],
      calories: 520,
      protein: 22,
      carbs: 65,
      fat: 18,
      cookTime: 25,
      servings: 4,
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg'
    },
    {
      id: '6',
      name: 'Grilled Salmon with Quinoa',
      ingredients: [
        '4 salmon fillets (150g each)',
        '1 cup quinoa',
        '2 cups vegetable broth',
        '2 tbsp olive oil',
        '1 lemon, juiced',
        '2 cloves garlic, minced',
        '1 tsp dried herbs',
        '2 cups mixed vegetables',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Rinse quinoa and cook in vegetable broth for 15 minutes.',
        'Season salmon with salt, pepper, and herbs.',
        'Heat olive oil in a pan over medium-high heat.',
        'Cook salmon for 4-5 minutes per side until flaky.',
        'Steam mixed vegetables until tender.',
        'Fluff quinoa with a fork.',
        'Serve salmon over quinoa with vegetables.',
        'Drizzle with lemon juice and garlic.'
      ],
      calories: 420,
      protein: 35,
      carbs: 30,
      fat: 18,
      cookTime: 25,
      servings: 4,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMeals = localStorage.getItem('profoodie_meals');
    const savedMealPlan = localStorage.getItem('profoodie_meal_plan');
    const savedRecipes = localStorage.getItem('profoodie_recipes');
    
    if (savedMeals) {
      try {
        setMeals(JSON.parse(savedMeals));
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    }
    
    if (savedMealPlan) {
      try {
        setMealPlan(JSON.parse(savedMealPlan));
      } catch (error) {
        console.error('Error loading meal plan:', error);
      }
    }
    
    if (savedRecipes) {
      try {
        const parsedRecipes = JSON.parse(savedRecipes);
        setRecipes(prev => [...prev, ...parsedRecipes.filter((r: Recipe) => 
          !prev.some(existing => existing.id === r.id)
        )]);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    }
  }, []);

  // Calculate personalized goals based on user profile
  const calculatePersonalizedGoals = () => {
    if (!user?.profile) {
      return; // Use default goals if no profile
    }

    const { age, gender, height, weight, activityLevel, goal } = user.profile;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9
    };

    const activityMultiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55;
    let tdee = bmr * activityMultiplier;

    // Adjust based on goal
    switch (goal) {
      case 'lose-weight':
        tdee *= 0.85; // 15% deficit
        break;
      case 'gain-weight':
        tdee *= 1.15; // 15% surplus
        break;
      case 'build-muscle':
        tdee *= 1.1; // 10% surplus
        break;
      // maintain weight keeps tdee as is
    }

    // Calculate macronutrient goals
    const calories = Math.round(tdee);
    
    // Protein: 1.6-2.2g per kg body weight (higher for muscle building)
    let proteinPerKg = 1.8;
    if (goal === 'build-muscle') proteinPerKg = 2.2;
    if (goal === 'lose-weight') proteinPerKg = 2.0; // Higher protein for weight loss
    
    const protein = Math.round(weight * proteinPerKg);
    
    // Fat: 25-30% of calories
    const fatPercentage = goal === 'lose-weight' ? 0.25 : 0.28;
    const fat = Math.round((calories * fatPercentage) / 9);
    
    // Carbs: remaining calories
    const carbCalories = calories - (protein * 4) - (fat * 9);
    const carbs = Math.round(carbCalories / 4);
    
    // Fiber: 14g per 1000 calories
    const fiber = Math.round((calories / 1000) * 14);
    
    // Water: 35ml per kg body weight + 500ml for exercise
    const water = Math.round(((weight * 35) / 1000) * 10) / 10; // Round to 1 decimal

    const newGoals = {
      calories,
      protein,
      carbs,
      fat,
      fiber,
      water
    };

    setPersonalizedGoals(newGoals);
    localStorage.setItem('profoodie_goals', JSON.stringify(newGoals));
  };

  // Recalculate goals when user profile changes
  useEffect(() => {
    if (user?.profile && user.onboardingCompleted) {
      calculatePersonalizedGoals();
    }
  }, [user?.profile, user?.onboardingCompleted]);

  // Load saved goals
  useEffect(() => {
    const savedGoals = localStorage.getItem('profoodie_goals');
    if (savedGoals) {
      try {
        setPersonalizedGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }
  }, []);

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    localStorage.setItem('profoodie_meals', JSON.stringify(updatedMeals));
  };

  const removeMeal = (id: string) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    localStorage.setItem('profoodie_meals', JSON.stringify(updatedMeals));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    
    // Save only user-created recipes (exclude default ones)
    const userRecipes = updatedRecipes.filter(r => !['1', '2', '3', '4'].includes(r.id));
    localStorage.setItem('profoodie_recipes', JSON.stringify(userRecipes));
  };

  const removeRecipe = (id: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    
    // Save only user-created recipes
    const userRecipes = updatedRecipes.filter(r => !['1', '2', '3', '4'].includes(r.id));
    localStorage.setItem('profoodie_recipes', JSON.stringify(userRecipes));
  };

  const updateMealPlan = (date: string, mealType: string, recipe: Recipe | null) => {
    const updatedMealPlan = { ...mealPlan };
    
    if (!updatedMealPlan[date]) {
      updatedMealPlan[date] = {};
    }
    
    if (recipe) {
      updatedMealPlan[date][mealType] = recipe;
    } else {
      delete updatedMealPlan[date][mealType];
      
      // Clean up empty date objects
      if (Object.keys(updatedMealPlan[date]).length === 0) {
        delete updatedMealPlan[date];
      }
    }
    
    setMealPlan(updatedMealPlan);
    localStorage.setItem('profoodie_meal_plan', JSON.stringify(updatedMealPlan));
  };

  const getMealPlan = (date: string, mealType: string): Recipe | null => {
    return mealPlan[date]?.[mealType] || null;
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = meals.filter(meal => meal.date === today);
  
  const dailyNutrition = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const value = {
    meals,
    recipes,
    mealPlan,
    personalizedGoals,
    addMeal,
    removeMeal,
    addRecipe,
    removeRecipe,
    updateMealPlan,
    getMealPlan,
    dailyNutrition,
    calculatePersonalizedGoals
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};