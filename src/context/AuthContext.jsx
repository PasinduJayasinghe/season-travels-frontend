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
    // Check against stored users
    const savedUsers = localStorage.getItem('seasonTravels_users');
    let users = [];
    
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    } else {
      // Initialize with default admin user if no users exist
      users = [
        {
          id: '1',
          fullName: 'Test Admin',
          email: 'test@gmail.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ];
      localStorage.setItem('seasonTravels_users', JSON.stringify(users));
    }

    // Find user with matching email
    const foundUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    
    if (!foundUser) {
      throw new Error('User not found');
    }

    // For now, we'll accept the hardcoded password 'admin' for all users
    // In a real app, you'd verify the hashed password
    if (userData.password !== 'admin') {
      throw new Error('Invalid password');
    }

    const user = {
      id: foundUser.id,
      email: foundUser.email,
      fullName: foundUser.fullName,
      role: foundUser.role,
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
