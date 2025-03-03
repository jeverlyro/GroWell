import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import SplashScreen from './screens/splashscreen';
import OnboardingScreen from './screens/onboarding';
import GetStartedScreen from './screens/getstarted';
import HomeScreen from './screens/homescreen';
import ProfileScreen from './screens/profile'; 
import EducationalContentScreen from './screens/educationalcontent';
import CommunityScreen from './screens/community';
import RemindersPage from './screens/reminder';

// Import feature screens
import StuntingCalculatorScreen from './screens/stuntingcalculator';
import NutritionPlanScreen from './screens/nutritionplan';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useRef(null);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          
          {/* Main App Screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EducationalContent" component={EducationalContentScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="StuntingCalculator" component={StuntingCalculatorScreen} />
          <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
          <Stack.Screen name="Reminders" component={RemindersPage} />
        </Stack.Navigator> 
      </NavigationContainer>
    </SafeAreaProvider>
  );
}