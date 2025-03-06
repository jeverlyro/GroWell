import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  FlatList,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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

const CarouselPagination = ({ data, activeIndex, scrollX }) => {
  const inputRange = [-1, 0, 1];
  const dotSize = 8;
  
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        // Create animation for each dot
        const width = scrollX.interpolate({
          inputRange: [
            (index - 1) * (Dimensions.get('window').width - 40),
            index * (Dimensions.get('window').width - 40),
            (index + 1) * (Dimensions.get('window').width - 40)
          ],
          outputRange: [dotSize, dotSize * 1.5, dotSize],
          extrapolate: 'clamp'
        });
        
        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 1) * (Dimensions.get('window').width - 40),
            index * (Dimensions.get('window').width - 40),
            (index + 1) * (Dimensions.get('window').width - 40)
          ],
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp'
        });
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              { 
                width,
                height: dotSize,
                opacity,
                backgroundColor: index === activeIndex ? '#20C997' : '#D1D1D1'
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  
  // Auto-scrolling functionality
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate next index
      const nextIndex = (activeCarouselIndex + 1) % carouselData.length;
      
      // Scroll to next item
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true
        });
      }
      
      // Update active index
      setActiveCarouselIndex(nextIndex);
    }, 4000);  // Auto scroll every 4 seconds
    
    return () => clearInterval(timer);
  }, [activeCarouselIndex]);
  
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>GroWell</Text>
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
            <Animated.FlatList
              ref={flatListRef}
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
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            />
            <CarouselPagination 
              data={carouselData} 
              activeIndex={activeCarouselIndex}
              scrollX={scrollX} 
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// Static styles with former dynamic styles incorporated
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
    fontSize: 24,
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
    borderRadius: 4,
    marginHorizontal: 4,
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
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
  title: {
    color: '#333333',
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  }
});

export default HomeScreen;