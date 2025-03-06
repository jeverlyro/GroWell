import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notifications to show alerts when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission to send notifications
export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  // Required for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#20C997',
    });
  }

  return token;
}

// Schedule a notification
export async function scheduleNotification(title, body, trigger) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
    return id;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

// Cancel a specific notification
export async function cancelNotification(notificationId) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Parse time string "10:00 AM" to Date object components
export function parseTimeString(timeString, dayString) {
  // Parse time
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  // Create date
  const now = new Date();
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  // Handle different day formats
  if (dayString === 'Tomorrow') {
    date.setDate(now.getDate() + 1);
  } else if (dayString === 'Daily') {
    // If time already passed today, schedule for tomorrow
    if (date < now) {
      date.setDate(now.getDate() + 1);
    }
  } else if (dayString.startsWith('Every')) {
    // Handle weekly reminders (e.g. "Every Sunday")
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = dayString.split(' ')[1].toLowerCase();
    const targetDayIndex = days.indexOf(targetDay);
    
    if (targetDayIndex !== -1) {
      const currentDay = now.getDay();
      let daysUntilTarget = targetDayIndex - currentDay;
      if (daysUntilTarget <= 0) daysUntilTarget += 7;
      date.setDate(now.getDate() + daysUntilTarget);
    }
  } else if (dayString.startsWith('Wed, Mar')) {
    // Specific date format like "Wed, Mar 6"
    const dateParts = dayString.split(', ');
    const monthDay = dateParts[1].split(' ');
    
    const months = {'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
                   'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11};
    
    date.setMonth(months[monthDay[0]]);
    date.setDate(parseInt(monthDay[1]));
  }

  return date;
}

// Get trigger for notification based on reminder settings
export function getTriggerFromReminder(reminder) {
  const date = parseTimeString(reminder.time, reminder.day);
  
  // Return appropriate trigger based on frequency
  if (reminder.day === 'Daily') {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true,
    };
  } else if (reminder.day.startsWith('Every')) {
    // Weekly reminder
    return {
      weekday: date.getDay() + 1, // expo-notifications uses 1-7 for weekdays
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true,
    };
  } else {
    // One-time reminder
    return date;
  }
}