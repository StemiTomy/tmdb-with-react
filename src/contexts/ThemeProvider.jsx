import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    sessionStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Función para aplicar cambios visuales
  const applyTheme = (themeToApply) => {
    const body = document.body;
    body.setAttribute('data-theme', themeToApply);

    // Actualizar el toggle visual moon/sun
    if (themeToApply === 'light') {
      document.getElementsByClassName("moon")[0]?.classList.add("sun");
      document.getElementsByClassName("tdnn")[0]?.classList.add("day");
    } else {
      document.getElementsByClassName("moon")[0]?.classList.remove("sun");
      document.getElementsByClassName("tdnn")[0]?.classList.remove("day");
    }
  };

  useEffect(() => {
    // Detectar theme en sessionStorage o preferencia del navegador
    let savedTheme = sessionStorage.getItem('theme');
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dark' : 'light';
    }
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para acceder más fácil
export const useTheme = () => useContext(ThemeContext);
