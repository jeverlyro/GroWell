import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';


// Import screens
import SplashScreen from './screens/splashscreen';
import OnboardingScreen from './screens/onboarding';
import GetStartedScreen from './screens/getstarted';
import HomeScreen from './screens/homescreen';
import ProfileScreen from './screens/profile'; 
import EducationalContentScreen from './screens/educationalcontent';
import CommunityScreen from './screens/community';
import RemindersPage from './screens/reminder';
import CreatePassword from './screens/createpassword';
import SignIn from './screens/signin';
// Import feature screens
import StuntingCalculatorScreen from './screens/stuntingcalculator';
import NutritionPlanScreen from './screens/nutritionplan';
import AddReminderScreen from './screens/addReminder';
import { registerForPushNotificationsAsync } from './screens/services/notificationService';

// Import settings screen
import SettingsScreen from './screens/settings/SettingsScreen';
import AccountSettings from './screens/settings/AccountSettings';
import LanguageSettings from './screens/settings/LanguageSettings';
import NotificationSettings from './screens/settings/NotificationSettings';
import EmailConfirmationScreen from './screens/emailverif';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
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
          return <MaterialIcons name ={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20C997',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'PlusJakartaSans-Bold',
        },
        tabBarPressColor: 'transparent',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={EducationalContentScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Reminder" component={RemindersPage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const navigationRef = useRef(null);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
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
          <Stack.Screen name="SignIn" component={SignIn}/>
          <Stack.Screen name="CreatePassword" component={CreatePassword}/>
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EducationalContent" component={EducationalContentScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="StuntingCalculator" component={StuntingCalculatorScreen} />
          <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
          <Stack.Screen name="Reminders" component={RemindersPage} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen}/>
          
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettings} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
          <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
          <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen}/>
        
        </Stack.Navigator> 
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return <AppContent />;
}