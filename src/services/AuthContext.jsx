import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tmdb_api_key = localStorage.getItem('tmdb_api_key');
    if (token && tmdb_api_key) {
      setIsAuthenticated(true);
      setApiKey(tmdb_api_key);
    }
  }, []);

  const login = (token, tmdb_api_key) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tmdb_api_key', tmdb_api_key);
    setIsAuthenticated(true);
    setApiKey(tmdb_api_key);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tmdb_api_key');
    setIsAuthenticated(false);
    setApiKey('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
