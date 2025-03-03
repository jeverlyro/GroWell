import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

const RemindersScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([
    {
      id: '1',
      title: 'Growth Measurement',
      description: 'Record height and weight',
      time: '10:00 AM',
      day: 'Tomorrow',
      isEnabled: true
    },
    {
      id: '2',
      title: 'Pediatrician Appointment',
      description: 'Regular check-up with Dr. Kim',
      time: '2:30 PM',
      day: 'Wed, Mar 6',
      isEnabled: true
    },
    {
      id: '3',
      title: 'Vitamin Supplement',
      description: 'Daily vitamin D dose',
      time: '8:00 AM',
      day: 'Daily',
      isEnabled: false
    },
    {
      id: '4',
      title: 'Meal Planning',
      description: 'Prepare weekly nutrition plan',
      time: '7:00 PM',
      day: 'Every Sunday',
      isEnabled: true
    }
  ]);

  const toggleSwitch = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? {...reminder, isEnabled: !reminder.isEnabled} : reminder
    ));
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
      
      <Switch
        trackColor={{ false: "#E0E0E0", true: "#20C997" }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#E0E0E0"
        onValueChange={() => toggleSwitch(reminder.id)}
        value={reminder.isEnabled}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders</Text>
        <TouchableOpacity>
          <MaterialIcons name="add" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.reminderCategories}>
          <TouchableOpacity style={[styles.categoryButton, styles.activeCategoryButton]}>
            <Text style={[styles.categoryText, styles.activeCategoryText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Nutrition</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Appointments</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.remindersSection}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          {reminders.map(reminder => renderReminderCard(reminder))}
        </View>
        
        <TouchableOpacity style={styles.addReminderButton}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addReminderText}>Add New Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomNavBar />
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
  reminderCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#20C997',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  remindersSection: {
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
  }
});

export default RemindersScreen;