import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MealPlannerPage from './pages/MealPlannerPage';
import TrackerPage from './pages/TrackerPage';
import RecipesPage from './pages/RecipesPage';
import AuthPage from './pages/AuthPage';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider, useSmartNotifications } from './components/Notifications/NotificationSystem';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding Route Component
const OnboardingRoute: React.FC = () => {
  const { user, completeOnboarding } = useAuth();
  const { notifyGoalAchieved } = useSmartNotifications();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.onboardingCompleted) {
    return <Navigate to="/app" replace />;
  }
  
  const handleOnboardingComplete = (userData: any) => {
    completeOnboarding(userData);
    notifyGoalAchieved('onboarding');
  };
  
  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/app" element={
          <ProtectedRoute>
            {user && !user.onboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Layout />
            )}
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="planner" element={<MealPlannerPage />} />
          <Route path="tracker" element={<TrackerPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-2xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            <span className="text-primary-500 lowercase">pro</span>
            <span className="text-white uppercase">FOODIE</span>
          </h1>
          <p className="text-secondary-400">Loading your nutrition journey...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AppProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;