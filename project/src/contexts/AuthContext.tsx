import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  onboardingCompleted: boolean;
  profile?: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
    goal: string;
    dietaryRestrictions: string[];
    preferredMeals: string[];
  };
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: Date;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => void;
  completeOnboarding: (userData: any) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('profoodie_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('profoodie_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isPremium: false,
        onboardingCompleted: false,
        subscription: {
          plan: 'free',
          status: 'active'
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('profoodie_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        isPremium: false,
        onboardingCompleted: false,
        subscription: {
          plan: 'free',
          status: 'active'
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('profoodie_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('profoodie_user');
  };

  const updateProfile = (profileData: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profileData }
      };
      setUser(updatedUser);
      localStorage.setItem('profoodie_user', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = (userData: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        onboardingCompleted: true,
        profile: userData
      };
      setUser(updatedUser);
      localStorage.setItem('profoodie_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};