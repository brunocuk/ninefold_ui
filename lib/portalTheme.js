'use client';

// Portal theme: Mono, dark only. The light/dark toggle was retired with the
// 2026 redesign; the API shape is kept so existing pages keep working.

import { createContext, useContext } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function PortalThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: 'dark', setTheme: () => {}, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function usePortalTheme() {
  return useContext(ThemeContext);
}

// Mono tokens (same for both keys: pages that read themes[theme] always get Mono).
const mono = {
  // Backgrounds
  bg: '#080808',
  bgCard: '#0F0F0F',
  bgCardHover: '#151514',
  bgSidebar: '#0F0F0F',
  bgInput: 'rgba(255, 255, 255, 0.04)',

  // Text
  text: '#F2F2F2',
  textSecondary: '#C9C9C9',
  textMuted: '#8E8E8E',

  // Borders
  border: 'rgba(255, 255, 255, 0.07)',
  borderLight: 'rgba(255, 255, 255, 0.05)',

  // Accents
  accent: '#00FF94',
  accentDark: '#00cc76',

  // Status colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Shadows
  shadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 8px 30px rgba(0, 0, 0, 0.5)',
};

export const themes = {
  light: mono,
  dark: mono,
};
