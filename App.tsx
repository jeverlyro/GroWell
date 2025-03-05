import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ThemeProvider, useTheme } from './context/ThemeContext';

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

// Import settings screen
import SettingsScreen from './screens/settings/SettingsScreen';
import AccountSettings from './screens/settings/AccountSettings';
import LanguageSettings from './screens/settings/LanguageSettings';
import AppearanceSettings from './screens/settings/AppearanceSettings';
import NotificationSettings from './screens/settings/NotificationSettings';


// Import theme settings
import { withTheming } from './components/withTheming';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        unmountOnBlur: false,
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Learn':
              iconName = 'menu-book';
              size = 22;
              break;
            case 'Community':
              iconName = 'people';
              size = 22;
              break;
            case 'Reminder':
              iconName = 'alarm';
              size = 22;
              break;
            case 'Profile':
              iconName = 'person';
              size = 22;
              break;
            default:
              iconName = 'home';
              size = 22;
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20C997',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: colors.background,
        },
        tabBarPressColor: 'transparent',
      })}
    >
      <Tab.Screen name="Home" component={withTheming(HomeScreen)} />
      <Tab.Screen name="Learn" component={withTheming(EducationalContentScreen)} />
      <Tab.Screen name="Community" component={withTheming(CommunityScreen)} />
      <Tab.Screen name="Reminder" component={withTheming(RemindersPage)} />
      <Tab.Screen name="Profile" component={withTheming(ProfileScreen)} />
    </Tab.Navigator>
  );
}

// Main App component that needs ThemeProvider
function AppContent() {
  const navigationRef = useRef(null);
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EducationalContent" component={EducationalContentScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="StuntingCalculator" component={StuntingCalculatorScreen} />
          <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
          <Stack.Screen name="Reminders" component={RemindersPage} />
          
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettings} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
          <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
          <Stack.Screen name="AppearanceSettings" component={AppearanceSettings} />
        </Stack.Navigator> 
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Root component that provides the theme
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}