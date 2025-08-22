// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('seasonTravels_user');
        const sessionExpiry = localStorage.getItem('seasonTravels_session_expiry');
        
        if (savedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          if (now < expiry) {
            // Session is still valid
            setUser(JSON.parse(savedUser));
          } else {
            // Session expired, clear storage
            logout();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = (userData) => {
    const user = {
      email: userData.email,
      loginTime: new Date().toISOString()
    };

    setUser(user);

    // Save to localStorage if remember me is checked
    if (userData.rememberMe) {
      const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
      const expiryTime = new Date().getTime() + sessionDuration;
      
      localStorage.setItem('seasonTravels_user', JSON.stringify(user));
      localStorage.setItem('seasonTravels_session_expiry', expiryTime.toString());
    } else {
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      const expiryTime = new Date().getTime() + sessionDuration;
      
      localStorage.setItem('seasonTravels_user', JSON.stringify(user));
      localStorage.setItem('seasonTravels_session_expiry', expiryTime.toString());
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seasonTravels_user');
    localStorage.removeItem('seasonTravels_session_expiry');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
