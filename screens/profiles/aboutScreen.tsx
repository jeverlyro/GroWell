import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const AboutScreen = ({ navigation }) => {
  const appVersion = "1.0.0";
  
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://growell.com/privacy-policy');
  };
  
  const handleTermsOfService = () => {
    Linking.openURL('https://growell.com/terms-of-service');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={19} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About GroWell</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/snack.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>GroWell</Text>
          <Text style={styles.appDescription}>Child Growth Monitoring & Nutrition</Text>
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionContent}>
            GroWell is dedicated to helping parents and caregivers track, understand, 
            and support their children's growth and development. We aim to provide 
            evidence-based information and tools that empower families to make 
            informed decisions about their children's nutrition and health.
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <MaterialIcons name="track-changes" size={20} color="#20C997" style={styles.featureIcon} />
            <Text style={styles.featureText}>Growth tracking with WHO standards</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="assessment" size={20} color="#20C997" style={styles.featureIcon} />
            <Text style={styles.featureText}>Personalized nutrition recommendations</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="notifications" size={20} color="#20C997" style={styles.featureIcon} />
            <Text style={styles.featureText}>Health checkup reminders</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="article" size={20} color="#20C997" style={styles.featureIcon} />
            <Text style={styles.featureText}>Expert articles on child development</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Development Team</Text>
          <Text style={styles.sectionContent}>
            GroWell is developed by a dedicated team of software engineers, 
            nutritionists, and pediatric health specialists committed to 
            creating tools that support child health and wellbeing.
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactText}>Email: support@growell.com</Text>
          <Text style={styles.contactText}>Website: www.growell.com</Text>
        </View>

        <View style={styles.legalContainer}>
          <TouchableOpacity style={styles.legalButton} onPress={handlePrivacyPolicy}>
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalButton} onPress={handleTermsOfService}>
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>© 2025 GroWell. All rights reserved.</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#20C997',
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#999999',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555555',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555555',
  },
  contactText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555555',
    marginBottom: 8,
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 10,
  },
  legalButton: {
    marginHorizontal: 15,
  },
  legalButtonText: {
    color: '#20C997',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  copyrightContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  copyrightText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});

export default AboutScreen;