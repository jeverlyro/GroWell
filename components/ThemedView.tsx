import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

const ThemedView: React.FC<ThemedViewProps> = ({ children, style, ...props }) => {
  const { colors } = useTheme();
  
  return (
    <View 
      style={[
        { 
          flex: 1, 
          backgroundColor: colors.background 
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

export default ThemedView;