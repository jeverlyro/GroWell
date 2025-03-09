import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const handleEditProfile = () => {
    navigation.navigate('AccountSettings');
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.navigate('SignIn') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={19} color="#333333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={require('../assets/snack.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>GroWell</Text>
          <Text style={styles.profileEmail}>growell.team@example.com</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.childrenSection}>
          <Text style={styles.sectionTitle}>My Children</Text>
          
          <View style={styles.childCard}>
            <Image
              source={require('../assets/snack.png')}
              style={styles.childImage}
            />
            <View style={styles.childInfo}>
              <Text style={styles.childName}>GroWell</Text>
              <Text style={styles.childAge}>3 years old</Text>
              <View style={styles.childStatsRow}>
                <View style={styles.childStat}>
                  <Text style={styles.statValue}>98 cm</Text>
                  <Text style={styles.statLabel}>Height</Text>
                </View>
                <View style={styles.childStat}>
                  <Text style={styles.statValue}>15 kg</Text>
                  <Text style={styles.statLabel}>Weight</Text>
                </View>
                <View style={styles.childStat}>
                  <Text style={styles.statValue}>Normal</Text>
                  <Text style={styles.statLabel}>Status</Text>
                </View>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.addChildButton}
            onPress={() => navigation.navigate('AddChildScreen')}
          >
            <MaterialIcons name="add-circle-outline" size={20} color="#20C997" />
            <Text style={styles.addChildText}>Add Another Child</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('GrowthTracker')}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons name="history" size={22} color="#20C997" />
            </View>
            <Text style={styles.menuItemText}>Growth History</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('SavedArticlesScreen')}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons name="favorite" size={22} color="#20C997" />
            </View>
            <Text style={styles.menuItemText}>Saved Articles</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('HelpAndSupportScreen')}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons name="help" size={22} color="#20C997" />
            </View>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('AboutScreen')}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons name="info" size={22} color="#20C997" />
            </View>
            <Text style={styles.menuItemText}>About GroWell</Text>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 15,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#20C997',
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
  },
  childrenSection: {
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
  childCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  childImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  childAge: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 10,
  },
  childStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  childStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  addChildText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#20C997',
    marginLeft: 5,
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
});

export default ProfileScreen;