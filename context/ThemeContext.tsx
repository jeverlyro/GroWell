import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  background: '#FFFFFF',
  text: '#333333',
  secondaryText: '#666666',
  headerBackground: '#FFFFFF',
  cardBackground: '#FFFFFF',
  borderColor: '#F0F0F0',
  primary: '#20C997',
  secondaryBackground: '#F8F9FA',
};

export const darkTheme = {
  background: '#202020',
  text: '#FFFFFF',
  secondaryText: '#CCCCCC',
  headerBackground: '#202020',
  cardBackground: '#2C2C2C',
  borderColor: '#383838',
  primary: '#20C997',
  secondaryBackground: '#2C2C2C',
};

// Define the context type
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
  themeMode: 'system' | 'light' | 'dark';
  colors: typeof lightTheme;
};

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
  themeMode: 'system',
  colors: lightTheme,
});

// Custom hook for using theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'system' | 'light' | 'dark'>('system');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load saved theme preference when component mounts
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('@theme_mode');
        if (savedThemeMode) {
          setThemeModeState(savedThemeMode as 'system' | 'light' | 'dark');
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setIsLoaded(true);
      }
    };
    
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const setThemeMode = async (mode: 'system' | 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Determine if dark mode based on theme mode and system settings
  const isDarkMode = 
    themeMode === 'system' 
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';
  
  // Get the appropriate color scheme
  const colors = isDarkMode ? darkTheme : lightTheme;
  
  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      // Force a re-render when system theme changes and we're in system mode
      console.log('System color scheme changed:', systemColorScheme);
    }
  }, [systemColorScheme, themeMode]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && themeMode === 'system') {
        // Force a re-render when app comes to foreground in system mode
        const currentSystemTheme = useColorScheme();
        if (currentSystemTheme !== systemColorScheme) {
          // Force re-render by updating state slightly
          setThemeModeState('system');
        }
      }
    });
  
    return () => {
      subscription.remove();
    };
  }, [systemColorScheme, themeMode]);

  if (!isLoaded) {
    // You could return a loading indicator here if needed
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkMode, 
        toggleTheme, 
        setThemeMode, 
        themeMode, 
        colors 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};