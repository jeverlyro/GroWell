import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { Button } from '../components/button';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Track Your Child\'s Growth',
    description: 'Monitor key milestones and detect early signs of stunting with our AI-powered tool.',
    image: require('../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Personalized Nutrition',
    description: 'Get meal plans and recommendations tailored to your child\'s age and health needs.',
    image: require('../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Expert Guidance',
    description: 'Access educational articles and videos backed by pediatric health experts.',
    image: require('../assets/onboarding3.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  });
  
  // For animation we need to explicitly set useNativeDriver to false
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Show loading screen until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }
  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('GetStarted');
    }
  };

  const renderIndicator = (index) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];
    
    const indicatorWidth = scrollX.interpolate({
      inputRange,
      outputRange: [5, 15, 5],
      extrapolate: 'clamp'
    });
    
    const backgroundColor = scrollX.interpolate({
      inputRange,
      outputRange: ['#E0E0E0', '#20C997', '#E0E0E0'],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.indicator,
          { 
            width: indicatorWidth,
            backgroundColor
          }
        ]}
      />
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image 
            source={item.image} 
            style={styles.image} 
            resizeMode="contain" 
          />
        </View>
        
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      <View style={styles.bottomContainer}>
        <View style={styles.indicatorsContainer}>
          {onboardingData.map((_, index) => renderIndicator(index))}
        </View>
        
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: width * 0.7,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  button: {
    width: '80%',
  },
});

export default OnboardingScreen;