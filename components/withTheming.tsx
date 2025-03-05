import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemedView from './ThemedView';

// Higher-Order Component to add theming to any screen
export const withTheming = (Component) => {
  return (props) => {
    const theme = useTheme();
    
    return (
      <ThemedView>
        <Component {...props} theme={theme} />
      </ThemedView>
    );
  };
};