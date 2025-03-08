import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    // Set notification channel for Android
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#20C997',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Only ask for permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // Return null if permission not granted
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    // Get expo push token
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

// Schedule a notification with proper trigger format
export async function scheduleNotification(title, body, trigger) {
  try {
    // Schedule the notification with the updated trigger format
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: body || '',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    throw error;
  }
}

// Cancel a specific notification
export async function cancelNotification(notificationId) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return true;
  } catch (error) {
    console.error("Error canceling notification:", error);
    return false;
  }
}

// Convert a reminder object to a proper notification trigger
export function getTriggerFromReminder(reminder) {
  try {
    // Parse time from reminder
    const reminderTime = reminder.notificationTime ? new Date(reminder.notificationTime) : new Date();
    
    // Different trigger based on frequency
    switch (reminder.frequency) {
      case 'Once':
        if (reminder.date) {
          const date = new Date(reminder.date);
          // Set the hours and minutes from the time
          date.setHours(reminderTime.getHours());
          date.setMinutes(reminderTime.getMinutes());
          date.setSeconds(0);
          
          // Use the proper trigger format
          return { 
            type: 'date',
            timestamp: date.getTime()
          };
        }
        break;
        
      case 'Daily':
        // Get current date and set time
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(reminderTime.getHours());
        tomorrow.setMinutes(reminderTime.getMinutes());
        tomorrow.setSeconds(0);
        
        // Daily repeat
        return {
          hour: reminderTime.getHours(),
          minute: reminderTime.getMinutes(),
          repeats: true
        };
        
      case 'Weekly':
        if (reminder.selectedDay) {
          // Get day index (0-6, where 0 is Sunday)
          const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayIndex = weekdays.indexOf(reminder.selectedDay);
          
          if (dayIndex !== -1) {
            // Set weekday, hours and minutes
            return {
              weekday: dayIndex + 1,
              hour: reminderTime.getHours(),
              minute: reminderTime.getMinutes(),
              repeats: true
            };
          }
        }
        break;
    }
    
    // Default to scheduling for next day if something goes wrong
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(reminderTime.getHours());
    tomorrow.setMinutes(reminderTime.getMinutes());
    tomorrow.setSeconds(0);
    
    return { 
      type: 'date',
      timestamp: tomorrow.getTime()
    };
    
  } catch (error) {
    console.error("Error creating trigger from reminder:", error);
    
    // Fallback to tomorrow at the same time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return { 
      type: 'date',
      timestamp: tomorrow.getTime()
    };
  }
}