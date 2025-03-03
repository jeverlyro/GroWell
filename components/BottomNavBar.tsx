import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentScreen = route.name;

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => navigation.navigate('Home')}
      >
        <MaterialIcons 
          name="home" 
          size={26} 
          color={currentScreen === 'Home' ? '#20C997' : '#999999'} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            currentScreen === 'Home' && styles.activeTab
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => navigation.navigate('EducationalContent')}
      >
        <MaterialIcons 
          name="menu-book" 
          size={26} 
          color={currentScreen === 'EducationalContent' ? '#20C997' : '#999999'} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            currentScreen === 'EducationalContent' && styles.activeTab
          ]}
        >
          Learn
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => navigation.navigate('Community')}
      >
        <MaterialIcons 
          name="people" 
          size={26} 
          color={currentScreen === 'Community' ? '#20C997' : '#999999'} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            currentScreen === 'Community' && styles.activeTab
          ]}
        >
          Community
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => navigation.navigate('Reminders')}
      >
        <MaterialIcons 
          name="notifications" 
          size={26} 
          color={currentScreen === 'Reminders' ? '#20C997' : '#999999'} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            currentScreen === 'Reminders' && styles.activeTab
          ]}
        >
          Reminders
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <MaterialIcons 
          name="person" 
          size={26} 
          color={currentScreen === 'Profile' ? '#20C997' : '#999999'} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            currentScreen === 'Profile' && styles.activeTab
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#999999',
  },
  activeTab: {
    color: '#20C997',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});

export default BottomNavBar;