import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Apply theme synchronously before first render to prevent flash
const savedTheme = localStorage.getItem('agritrust-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(savedTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agritrust-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
