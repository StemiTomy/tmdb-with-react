// src/contexts/ThemeProviderAntd.jsx
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useState, useEffect, createContext, useContext } from 'react';
import { darkTokens, lightTokens } from './themeTokens'; // Luego veremos cómo definirlos si quieres

const ThemeContext = createContext();

export const ThemeProviderAntd = ({ children }) => {
  const [themeMode, setThemeMode] = useState('dark'); // dark por defecto

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    sessionStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('theme');
    const initialTheme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setThemeMode(initialTheme);
  }, []);
  
  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);
  
  

  const isDarkMode = themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: isDarkMode ? darkTokens : lightTokens,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeAntd = () => useContext(ThemeContext);
