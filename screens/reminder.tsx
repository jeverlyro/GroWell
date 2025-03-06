import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, scheduleNotification, cancelNotification, getTriggerFromReminder } from './services/notificationService';

const REMINDERS_STORAGE_KEY = '@GroWell:reminders';

const RemindersScreen = ({ navigation, route }) => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reminders from AsyncStorage
  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
      Alert.alert('Error', 'Could not load your reminders');
    } finally {
      setIsLoading(false);
    }
  };

  // Save reminders to AsyncStorage
  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
      Alert.alert('Error', 'Could not save your reminders');
    }
  };
  
  // Setup notifications and load reminders when component mounts
  useEffect(() => {
    // Request notification permissions
    registerForPushNotificationsAsync();
    
    // Load saved reminders
    loadReminders();
  }, []);
  
  // Handle existing reminders' notifications
  useEffect(() => {
    if (!isLoading) {
      // Schedule notifications for enabled reminders
      reminders.forEach(async reminder => {
        if (reminder.isEnabled) {
          await handleNotification(reminder, true);
        }
      });
    }
  }, [isLoading]);
  
  // Set up listener for new reminders (from AddReminder screen)
  useEffect(() => {
    if (route.params?.newReminder) {
      const newReminder = route.params.newReminder;
      
      setReminders(currentReminders => {
        // Generate a new ID (just using timestamp for simplicity)
        const id = Date.now().toString();
        const updatedReminder = { ...newReminder, id, isEnabled: true, notificationId: null };
        
        // Schedule notification for the new reminder
        handleNotification(updatedReminder, true);
        
        const updatedReminders = [...currentReminders, updatedReminder];
        // Save to AsyncStorage
        saveReminders(updatedReminders);
        
        return updatedReminders;
      });
      
      // Clear the parameter to prevent duplicate additions
      navigation.setParams({ newReminder: null });
    }
  }, [route.params?.newReminder]);
  
  // Handle scheduling or canceling notifications when reminder is toggled
  const handleNotification = async (reminder, enabled) => {
    // Cancel existing notification if there is one
    if (reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    
    if (enabled) {
      try {
        // Schedule new notification
        const trigger = getTriggerFromReminder(reminder);
        const notificationId = await scheduleNotification(
          reminder.title,
          reminder.description,
          trigger
        );
        
        // Update reminder with notification ID
        setReminders(currentReminders => {
          const updatedReminders = currentReminders.map(r => 
            r.id === reminder.id ? { ...r, notificationId } : r
          );
          
          // Save to AsyncStorage
          saveReminders(updatedReminders);
          
          return updatedReminders;
        });
        
        return notificationId;
      } catch (error) {
        console.error("Failed to schedule notification:", error);
        Alert.alert("Notification Error", "Could not schedule notification for this reminder.");
      }
    }
    
    return null;
  };

  const toggleSwitch = async (id) => {
    setReminders(currentReminders => {
      const updatedReminders = currentReminders.map(reminder => {
        if (reminder.id === id) {
          const updatedReminder = { ...reminder, isEnabled: !reminder.isEnabled };
          // Schedule or cancel notification
          handleNotification(updatedReminder, updatedReminder.isEnabled);
          return updatedReminder;
        }
        return reminder;
      });
      
      // Save to AsyncStorage
      saveReminders(updatedReminders);
      
      return updatedReminders;
    });
  };

  const deleteReminder = async (id) => {
    // Find the reminder to get its notification ID
    const reminderToDelete = reminders.find(r => r.id === id);
    
    // Cancel the notification if it exists
    if (reminderToDelete && reminderToDelete.notificationId) {
      await cancelNotification(reminderToDelete.notificationId);
    }
    
    // Remove the reminder from state
    setReminders(currentReminders => {
      const updatedReminders = currentReminders.filter(reminder => reminder.id !== id);
      
      // Save to AsyncStorage
      saveReminders(updatedReminders);
      
      return updatedReminders;
    });
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Delete", 
          onPress: () => deleteReminder(id),
          style: "destructive"
        }
      ]
    );
  };

  const renderReminderCard = (reminder) => (
    <View key={reminder.id} style={styles.reminderCard}>
      <View style={styles.reminderInfo}>
        <View style={[styles.reminderIcon, {backgroundColor: reminder.isEnabled ? '#E3F8F1' : '#F5F5F5'}]}>
          <MaterialIcons 
            name="notifications-active" 
            size={24} 
            color={reminder.isEnabled ? '#20C997' : '#AAAAAA'} 
          />
        </View>
        <View style={styles.reminderContent}>
          <Text style={styles.reminderTitle}>{reminder.title}</Text>
          <Text style={styles.reminderDescription}>{reminder.description}</Text>
          <View style={styles.reminderTimeContainer}>
            <MaterialIcons name="access-time" size={14} color="#666666" />
            <Text style={styles.reminderTime}>{reminder.time} • {reminder.day}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.reminderActions}>
        <Switch
          trackColor={{ false: "#E0E0E0", true: "#20C997" }}
          thumbColor={"#FFFFFF"}
          ios_backgroundColor="#E0E0E0"
          onValueChange={() => toggleSwitch(reminder.id)}
          value={reminder.isEnabled}
          style={styles.reminderSwitch}
        />
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => confirmDelete(reminder.id)}
        >
          <MaterialIcons name="delete-outline" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MaterialIcons name="notifications-off" size={64} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>No Reminders Yet</Text>
      <Text style={styles.emptyStateDescription}>
        You don't have any reminders set up yet. Add a new reminder to get started.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {reminders.length > 0 ? (
          <View style={styles.remindersSection}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            {reminders.map(reminder => renderReminderCard(reminder))}
          </View>
        ) : (
          <View style={styles.emptyStateWrapper}>
            {renderEmptyState()}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.addReminderButton}
          onPress={() => navigation.navigate('AddReminder')}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addReminderText}>Add New Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#20C997',
  },
  scrollView: {
    flex: 1,
  },
  remindersSection: {
    padding: 15,
  },
  emptyStateWrapper: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTime: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginLeft: 5,
  },
  addReminderButton: {
    flexDirection: 'row',
    backgroundColor: '#20C997',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 20,
  },
  addReminderText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderSwitch: {
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RemindersScreen;