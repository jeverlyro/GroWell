import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const PrivacySettingsScreen = ({ navigation }) => {
  // State for toggle switches
  const [dataCollection, setDataCollection] = useState(true);
  const [locationServices, setLocationServices] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [targetedContent, setTargetedContent] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  
  // Function to navigate to detailed privacy pages
  const navigateToPrivacyDetails = (screenName) => {
    // This would navigate to more detailed screens for each privacy topic
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Control how your information is collected and used within the app. 
            These settings help protect your privacy while allowing us to provide 
            you with the best possible experience.
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data Collection</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Anonymous Data Collection</Text>
              <Text style={styles.settingDescription}>
                Allow the app to collect anonymous usage data to improve our services
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "#20C997" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setDataCollection}
              value={dataCollection}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Location Services</Text>
              <Text style={styles.settingDescription}>
                Allow the app to access your location for regional health recommendations
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "#20C997" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setLocationServices}
              value={locationServices}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Analytics</Text>
              <Text style={styles.settingDescription}>
                Help us improve by allowing analytical tracking of app usage
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "#20C997" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setAnalytics}
              value={analytics}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Content & Communication</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Personalized Content</Text>
              <Text style={styles.settingDescription}>
                Receive content and recommendations tailored to your child's growth
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "#20C997" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setTargetedContent}
              value={targetedContent}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Third-Party Data Sharing</Text>
              <Text style={styles.settingDescription}>
                Allow sharing of anonymized data with trusted research partners
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "#20C997" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setThirdPartySharing}
              value={thirdPartySharing}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToPrivacyDetails('DataExportScreen')}
          >
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Export Your Data</Text>
              <Text style={styles.actionDescription}>
                Download a copy of all your personal data stored in our system
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToPrivacyDetails('DeleteAccountScreen')}
          >
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, styles.redText]}>Delete Account & Data</Text>
              <Text style={styles.actionDescription}>
                Permanently delete your account and all associated data
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        <View style={styles.privacyLinksContainer}>
          <TouchableOpacity 
            style={styles.privacyLink}
            onPress={() => navigation.navigate('AboutScreen')}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.privacyLink}
            onPress={() => navigation.navigate('AboutScreen')}
          >
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.privacyLink}
            onPress={() => navigation.navigate('AboutScreen')}
          >
            <Text style={styles.linkText}>Data Protection</Text>
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
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    lineHeight: 22,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    lineHeight: 19,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  redText: {
    color: '#FF6B6B',
  },
  privacyLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  privacyLink: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    textDecorationLine: 'underline',
  },
});

export default PrivacySettingsScreen;