import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';
import { signOut } from "firebase/auth";
import { auth } from '../../firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userApiKey = localStorage.getItem('userApiKey');
    if (token && userApiKey) {
      setIsAuthenticated(true);
      setApiKey(userApiKey);
    }
    setIsLoading(false);
  }, []);

  const login = (token, userApiKey) => {
    setIsLoading(true);
    setError(null);
    localStorage.setItem('token', token);
    localStorage.setItem('userApiKey', userApiKey);
    setIsAuthenticated(true);
    setApiKey(userApiKey);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut(auth); // 🔥 esto cierra sesión en Firebase de verdad
    } catch (error) {
      console.error("Error al cerrar sesión en Firebase:", error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userApiKey');
    setIsAuthenticated(false);
    setApiKey('');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, login, logout, isLoading }}>
      {isLoading && !isAuthenticated ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

