import React, { createContext, useState, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Create provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy use of context
export const useTheme  = () => useContext(ThemeContext);
