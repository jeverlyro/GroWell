import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Image carousel data
const carouselData = [
  {
    id: "1",
    image: require("../assets/logo.png"),
    title: "Healthy Eating Habits",
    description: "Start early with nutritious foods",
  },
  {
    id: "2",
    image: require("../assets/logo.png"),
    title: "Track Growth Milestones",
    description: "Regular monitoring prevents stunting",
  },
  {
    id: "3",
    image: require("../assets/logo.png"),
    title: "Balanced Nutrition",
    description: "Essential nutrients for development",
  },
];

const services = [
  {
    id: "1",
    title: "Stunting Calculator",
    icon: "calculate",
    screen: "StuntingCalculator",
    color: "#20C997",
  },
  {
    id: "2",
    title: "Nutrition Plans",
    icon: "restaurant",
    screen: "NutritionPlan",
    color: "#20C997",
  },
  {
    id: "3",
    title: "Growth Tracker",
    icon: "trending-up",
    screen: "GrowthTracker",
    color: "#20C997",
  },
  {
    id: "4",
    title: "Reminders",
    icon: "notifications",
    screen: "ReminderPage",
    color: "#20C997",
  },
];

const ServiceIcon = ({ title, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.serviceItem} onPress={onPress}>
      <View style={styles.serviceIconContainer}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.serviceTitle} numberOfLines={1}>
        {title}
      </Text>
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
  const windowWidth = Dimensions.get("window").width;
  const dotSize = 8;

  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        // Create animation for each dot
        const width = scrollX.interpolate({
          inputRange: [
            (index - 1) * (windowWidth - 40),
            index * (windowWidth - 40),
            (index + 1) * (windowWidth - 40),
          ],
          outputRange: [dotSize, dotSize * 1.5, dotSize],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 1) * (windowWidth - 40),
            index * (windowWidth - 40),
            (index + 1) * (windowWidth - 40),
          ],
          outputRange: [0.5, 1, 0.5],
          extrapolate: "clamp",
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
                backgroundColor: index === activeIndex ? "#20C997" : "#D1D1D1",
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const windowWidth = Dimensions.get("window").width;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Auto-scrolling functionality
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate next index
      const nextIndex = (activeCarouselIndex + 1) % carouselData.length;

      // Scroll to next item
      if (flatListRef.current) {
        try {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewOffset: 0,
            viewPosition: 0,
          });
        } catch (error) {
          console.log("Scroll error:", error);
        } finally {
          // Always update the active index regardless of scroll success
          setActiveCarouselIndex(nextIndex);
        }
      } else {
        // If ref isn't ready yet, just update the index
        setActiveCarouselIndex(nextIndex);
      }
    }, 4000); // Auto scroll every 4 seconds

    return () => clearInterval(timer);
  }, [activeCarouselIndex]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>GroWell</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Hello there!</Text>
            <Text style={styles.welcomeSubText}>
              Track and boost your child's growth journey with GroWell
            </Text>
          </View>

          <View style={styles.servicesContainer}>
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <ServiceIcon
                  key={service.id}
                  title={service.title}
                  icon={service.icon}
                  color={service.color}
                  onPress={() => {
                    if (service.id === "4") { 
                      navigation.navigate("MainApp", { screen: "ReminderPage" });
                    } else {
                      navigation.navigate(service.screen);
                    }
                  }}
                />
              ))}
            </View>
          </View>

          {/* Carousel/Image Slider */}
          <View style={styles.carouselSection}>
            <View style={styles.carouselContainer}>
              <Animated.FlatList
                ref={flatListRef}
                data={carouselData}
                renderItem={({ item }) => <CarouselItem item={item} />}
                keyExtractor={(item) => item.id}
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
          </View>

          {/* Growth Tracking Card */}
          <View style={styles.growthSection}>
            <Text style={styles.sectionTitle}>Recent Growth Data</Text>
            <View style={styles.growthCard}>
              <View style={styles.growthHeader}>
                <MaterialIcons name="child-care" size={24} color="#20C997" />
                <Text style={styles.growthCardTitle}>Track Growth Progress</Text>
              </View>
              <Text style={styles.growthCardDescription}>
                Regularly record height, weight, and milestones
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("GrowthTracker")}
              >
                <Text style={styles.actionButtonText}>Update Growth Data</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tip of the Day Card */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Daily Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <MaterialIcons name="lightbulb" size={24} color="#20C997" />
                <Text style={styles.tipTitle}>Tip of the Day</Text>
              </View>
              <Text style={styles.tipText}>
                Include protein in every meal to support your child's muscle development.
              </Text>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>More Tips</Text>
                <MaterialIcons name="chevron-right" size={16} color="#20C997" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Bottom padding */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// Simplified GoJek-inspired styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#20C997",
  },
  notificationButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333333",
    marginBottom: 8,
  },
  welcomeSubText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#555555",
    marginBottom: 16,
    maxWidth: "70%",
  },
  
  // Services grid - now with only 4 icons in a 2x2 grid
  servicesContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  serviceItem: {
    width: "45%", // 2 icons per row with some spacing
    alignItems: "center",
    marginBottom: 20,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#F0FFF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#333333",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333333",
    marginBottom: 12,
  },
  
  // Carousel section
  carouselSection: {
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  carouselContainer: {
    marginVertical: 10,
  },
  carouselItem: {
    width: Dimensions.get("window").width - 40,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#F5F5F5",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 12,
  },
  carouselTitle: {
    color: "white",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 2,
  },
  carouselDescription: {
    color: "white",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  paginationDot: {
    borderRadius: 4,
    marginHorizontal: 4,
  },
  
  // Growth section
  growthSection: {
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  growthCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F0FFF2",
  },
  growthHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  growthCardTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333333",
    marginLeft: 10,
  },
  growthCardDescription: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#555555",
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: "#20C997",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
  },
  
  // Tips section
  tipsSection: {
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F6FFF8",
    borderWidth: 1,
    borderColor: "#E0F0E5",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333333",
    marginLeft: 10,
  },
  tipText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#555555",
    marginBottom: 12,
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  moreButtonText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#20C997",
    marginRight: 4,
  },
});

export default HomeScreen;