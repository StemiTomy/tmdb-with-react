import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userApiKey = localStorage.getItem('userApiKey');
    if (token && userApiKey) {
      setIsAuthenticated(true);
      setApiKey(userApiKey);
    }
  }, []);

  const login = (token, userApiKey) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userApiKey', userApiKey);
    setIsAuthenticated(true);
    setApiKey(userApiKey);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userApiKey');
    setIsAuthenticated(false);
    setApiKey('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
