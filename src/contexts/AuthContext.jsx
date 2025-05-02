import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';
import { events } from '../api/events';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import { fetchUserAuth } from '../api'; // Este llama a /api/auth/user/

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // ❌ no usamos localStorage
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/login', '/register'];
    
    if (publicRoutes.includes(location.pathname)) {
      // 👇 No comprobamos sesión si estamos en rutas públicas
      setIsLoading(false);
      return;
    }

    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const userData = await fetchUserAuth();
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        console.warn("⛔ Sesión no válida:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 🔁 Nos suscribimos al evento global para detectar expiraciones
    events.onSessionExpired = () => {
      message.error('⚡ Sesión expirada, por favor vuelve a iniciar sesión.');
      setIsAuthenticated(false);
      setUser(null);
    };

    return () => {
      events.onSessionExpired = null;
    };
  }, [location.pathname]);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user }}>
      {isLoading && !isAuthenticated ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
