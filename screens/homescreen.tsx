import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

// Feature cards data - reduced to just the main features
const features = [
  {
    id: '1',
    title: 'Stunting Risk Calculator',
    description: 'AI-based analysis to detect early signs of stunting',
    icon: require('../assets/calculator-icon.png'),
    screen: 'StuntingCalculator',
    color: '#E3F8F1',
  },
  {
    id: '2',
    title: 'Personalized Nutrition Plans',
    description: 'Meal recommendations based on age and health data',
    icon: require('../assets/nutrition-icon.png'),
    screen: 'NutritionPlan',
    color: '#FFF3E0',
  },
];

const FeatureCard = ({ title, description, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <Image source={icon} style={styles.cardIcon} resizeMode="contain" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GroWell</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={require('../assets/profile-placeholder.png')} 
            style={styles.profileIcon} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Hello, Parent!</Text>
          <Text style={styles.welcomeSubtitle}>Track your child's growth and health</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Core Features</Text>
          
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              onPress={() => navigation.navigate(feature.screen)}
            />
          ))}
        </View>
        
        <View style={styles.growthTrackerSection}>
          <Text style={styles.sectionTitle}>Recent Growth Data</Text>
          <View style={styles.growthCard}>
            <Text style={styles.growthCardTitle}>Track your child's growth</Text>
            <Text style={styles.growthCardDescription}>
              Regularly record height, weight, and milestones to monitor progress
            </Text>
            <TouchableOpacity style={styles.addDataButton}>
              <Text style={styles.addDataButtonText}>Add New Data</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginTop: 5,
  },
  featuresContainer: {
    padding: 20,
  },
  growthTrackerSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  growthCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
  },
  growthCardTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 10,
  },
  growthCardDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 15,
  },
  addDataButton: {
    backgroundColor: '#20C997',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addDataButtonText: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
  }
});

export default HomeScreen;