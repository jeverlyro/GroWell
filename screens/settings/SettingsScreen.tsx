import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('AccountSettings')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="person" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Account Settings</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="lock" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Privacy and Security</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('NotificationSettings')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="notifications" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('LanguageSettings')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="language" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Language</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('AppearanceSettings')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="invert-colors" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Appearance</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="help" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="feedback" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>Send Feedback</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="info" size={22} color="#20C997" />
            </View>
            <Text style={styles.settingItemText}>About GroWell</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Log Out</Text>
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
  settingsSection: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
});

export default SettingsScreen;