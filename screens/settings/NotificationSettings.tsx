import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NotificationSettings = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [growthUpdates, setGrowthUpdates] = useState(true);
  const [nutritionTips, setNutritionTips] = useState(true);
  const [developmentMilestones, setDevelopmentMilestones] = useState(true);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingItemText}>Push Notifications</Text>
            <Switch
              trackColor={{ false: "#DDDDDD", true: "#A5EDD5" }}
              thumbColor={pushNotifications ? "#20C997" : "#FFFFFF"}
              ios_backgroundColor="#DDDDDD"
              onValueChange={() => setPushNotifications(!pushNotifications)}
              value={pushNotifications}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingItemText}>Email Notifications</Text>
            <Switch
              trackColor={{ false: "#DDDDDD", true: "#A5EDD5" }}
              thumbColor={emailNotifications ? "#20C997" : "#FFFFFF"}
              ios_backgroundColor="#DDDDDD"
              onValueChange={() => setEmailNotifications(!emailNotifications)}
              value={emailNotifications}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingItemText}>Growth Checkup Reminders</Text>
              <Text style={styles.settingItemDescription}>Reminder to record your child's growth data</Text>
            </View>
            <Switch
              trackColor={{ false: "#DDDDDD", true: "#A5EDD5" }}
              thumbColor={reminderNotifications ? "#20C997" : "#FFFFFF"}
              ios_backgroundColor="#DDDDDD"
              onValueChange={() => setReminderNotifications(!reminderNotifications)}
              value={reminderNotifications}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingItemText}>Growth Status Updates</Text>
              <Text style={styles.settingItemDescription}>Updates about your child's growth progress</Text>
            </View>
            <Switch
              trackColor={{ false: "#DDDDDD", true: "#A5EDD5" }}
              thumbColor={growthUpdates ? "#20C997" : "#FFFFFF"}
              ios_backgroundColor="#DDDDDD"
              onValueChange={() => setGrowthUpdates(!growthUpdates)}
              value={growthUpdates}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingItemText}>Nutrition Tips</Text>
              <Text style={styles.settingItemDescription}>Tips about healthy nutrition for your child</Text>
            </View>
            <Switch
              trackColor={{ false: "#DDDDDD", true: "#A5EDD5" }}
              thumbColor={nutritionTips ? "#20C997" : "#FFFFFF"}
              ios_backgroundColor="#DDDDDD"
              onValueChange={() => setNutritionTips(!nutritionTips)}
              value={nutritionTips}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingItemText}>Development Milestones</Text>
              <Text style={styles.settingItemDescription}>Updates about developmental milestones</Text>
            </View>
            <Switch
              trackColor={{ false: "#DDDDDD", true: "#A5EDD5" }}
              thumbColor={developmentMilestones ? "#20C997" : "#FFFFFF"}
              ios_backgroundColor="#DDDDDD"
              onValueChange={() => setDevelopmentMilestones(!developmentMilestones)}
              value={developmentMilestones}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
  },
  settingItemDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#20C997',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: 'white',
  },
});

export default NotificationSettings;