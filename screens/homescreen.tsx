import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ThemedView from '../components/ThemedView';
import { useTheme } from '../context/ThemeContext';

// Image carousel data
const carouselData = [
  {
    id: '1',
    image: require('../assets/logo.png'),
    title: 'Healthy Eating Habits',
    description: 'Start early with nutritious foods'
  },
  {
    id: '2',
    image: require('../assets/logo.png'),
    title: 'Track Growth Milestones',
    description: 'Regular monitoring prevents stunting'
  },
  {
    id: '3',
    image: require('../assets/logo.png'),
    title: 'Balanced Nutrition',
    description: 'Essential nutrients for development'
  },
];

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

const CarouselItem = ({ item }) => {
  return (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} />
      <View style={styles.carouselTextContainer}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

const CarouselPagination = ({ data, activeIndex }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex ? styles.paginationDotActive : styles.paginationDotInactive
          ]}
        />
      ))}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  // Dynamic styles using theme colors
  const dynamicStyles = StyleSheet.create({
    title: {
      color: colors.text,
      fontSize: 24,
      fontFamily: 'PlusJakartaSans-Bold',
    },
    subtitle: {
      color: colors.secondaryText,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Medium',
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderColor: colors.borderColor,
      // other card styles
    },
    // Add other styles that should change with theme
  });
  
  return (
    <ThemedView>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={dynamicStyles.title}>GroWell</Text>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
              <Image 
                source={require('../assets/profile-placeholder.png')} 
                style={styles.profileIcon} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Hello, Parent!</Text>
            <Text style={styles.welcomeSubtitle}>Track your child's growth and health</Text>
          </View>
          
          {/* Carousel/Image Slider */}
          <View style={styles.carouselContainer}>
            <FlatList
              data={carouselData}
              renderItem={({ item }) => <CarouselItem item={item} />}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              snapToInterval={windowWidth - 40}
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.round(
                  event.nativeEvent.contentOffset.x / (windowWidth - 40)
                );
                setActiveCarouselIndex(slideIndex);
              }}
            />
            <CarouselPagination 
              data={carouselData} 
              activeIndex={activeCarouselIndex} 
            />
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
              <TouchableOpacity 
                style={styles.addDataButton}
                onPress={() => navigation.navigate('GrowthTracker')}
              >
                <Text style={styles.addDataButtonText}>Add New Data</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quick Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Quick Tips</Text>
            <View style={styles.tipCard}>
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.tipIcon} 
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Tip of the Day</Text>
                <Text style={styles.tipText}>
                  Include protein in every meal to support your child's muscle development.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>GroWell - Nurturing Healthy Growth</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

// Static styles that don't need to change with theme
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
  
  // Carousel Styles
  carouselContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  carouselItem: {
    width: Dimensions.get('window').width - 40,
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 20,
    backgroundColor: '#F5F5F5',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  carouselTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
  },
  carouselTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 4,
  },
  carouselDescription: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#20C997',
  },
  paginationDotInactive: {
    backgroundColor: '#D1D1D1',
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
  },
  
  // Quick Tips Section
  tipsSection: {
    padding: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F8F1',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  tipIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555555',
  },
  
  // Footer
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'PlusJakartaSans-Regular',
  }
});

export default HomeScreen;