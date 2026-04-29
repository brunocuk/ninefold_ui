'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function PortalThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const savedTheme = localStorage.getItem('portal-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      return;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('portal-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('portal-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    handleSetTheme(newTheme);
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function usePortalTheme() {
  return useContext(ThemeContext);
}

// Theme color definitions
export const themes = {
  light: {
    // Backgrounds
    bg: '#f5f5f7',
    bgCard: '#ffffff',
    bgCardHover: '#fafafa',
    bgSidebar: '#1c1c1e',
    bgInput: '#f5f5f7',

    // Text
    text: '#1d1d1f',
    textSecondary: '#6e6e73',
    textMuted: '#86868b',

    // Borders
    border: '#e5e5e7',
    borderLight: '#f0f0f2',

    // Accents
    accent: '#00FF94',
    accentDark: '#00cc76',

    // Status colors
    success: '#34c759',
    warning: '#ff9f0a',
    error: '#ff3b30',
    info: '#007aff',

    // Shadows
    shadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  dark: {
    // Backgrounds
    bg: '#000000',
    bgCard: '#1c1c1e',
    bgCardHover: '#2c2c2e',
    bgSidebar: '#000000',
    bgInput: '#1c1c1e',

    // Text
    text: '#f5f5f7',
    textSecondary: '#a1a1a6',
    textMuted: '#6e6e73',

    // Borders
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',

    // Accents
    accent: '#00FF94',
    accentDark: '#00cc76',

    // Status colors
    success: '#30d158',
    warning: '#ffd60a',
    error: '#ff453a',
    info: '#0a84ff',

    // Shadows
    shadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    shadowLg: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },
};
