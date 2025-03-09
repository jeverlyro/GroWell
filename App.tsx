import React, { useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

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
import GrowthTrackerScreen from './screens/GrowthTrackerScreen';
import { registerForPushNotificationsAsync } from './screens/services/notificationService';

// Import settings screen
import SettingsScreen from "./screens/settings/SettingsScreen";
import AccountSettings from "./screens/settings/AccountSettings";
import LanguageSettings from "./screens/settings/LanguageSettings";
import NotificationSettings from "./screens/settings/NotificationSettings";
import EmailConfirmationScreen from "./screens/emailverif";
import ChatbotScreen from "./screens/chatbot";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Learn':
              iconName = 'menu-book';
              break;
            case "Grow AI":
              iconName = "chat";
              break;
            case 'ReminderPage':  // Updated from 'Reminder' to 'ReminderPage'
              iconName = 'alarm';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
            case 'ChatBot':
              iconName = 'chat';
              break;
            default:
              iconName = 'home';
          }
          return <MaterialIcons name={iconName} size={22} color={color} />;
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
        lazy: true, 
        animationEnabled: true,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Learn" 
        component={EducationalContentScreen}
      />
      <Tab.Screen 
        name="ChatBot" 
        component={ChatbotScreen}
      />
      <Tab.Screen 
        name="ReminderPage" 
        component={RemindersPage}
        options={{ tabBarLabel: 'Reminder' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const navigationRef = useRef(null);
  
  useEffect(() => {
    // Register for push notifications when app starts
    registerForPushNotificationsAsync().catch(err => 
      console.log('Failed to register for push notifications:', err)
    );
  }, []);

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
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
            detachPreviousScreen: true,
          }}
        >
          {/* Auth flow screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="SignIn" component={SignIn}/>
          <Stack.Screen name="CreatePassword" component={CreatePassword}/>

          <Stack.Screen name="NewPassword" component={NewPassword}/>
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EducationalContent" component={EducationalContentScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />

          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="CreatePassword" component={CreatePassword} />
          <Stack.Screen name="MainApp" component={MainTabs} />
          <Stack.Screen name="StuntingCalculator" component={StuntingCalculatorScreen} />
          <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen} />
          <Stack.Screen name="GrowthTracker" component={GrowthTrackerScreen} />
          <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} />

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