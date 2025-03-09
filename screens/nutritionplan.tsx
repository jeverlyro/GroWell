import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';

const NutritionPlanScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [waterIntake, setWaterIntake] = useState(3);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7); // 1-7 (Mon-Sun), convert Sunday from 0 to 7
  
  // Load fonts with error handling
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'JakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
          'JakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
          'JakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
        });
      } catch (error) {
        console.log('Error loading fonts:', error);
      } finally {
        setFontsLoaded(true);
      }
    }
    
    loadFonts();
  }, []);
  
  // Use a loading screen if you want to wait for fonts
  if (!fontsLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  // Sample nutrition plan data
  const mealPlan = {
    breakfast: {
      title: 'Breakfast',
      time: '7:00 AM',
      meal: 'Oatmeal with fruits',
      description: 'Oatmeal topped with sliced bananas, strawberries, and a spoonful of honey.',
      nutrients: {
        calories: 320,
        protein: '8g',
        carbs: '58g',
        fat: '6g',
      },
      image: require('../assets/breakfast.png'),
      icon: 'wb-sunny', // Morning sun icon
    },
    lunch: {
      title: 'Lunch',
      time: '12:30 PM',
      meal: 'Chicken and vegetable soup',
      description: 'Soup with chicken pieces, carrots, peas, and whole grain bread.',
      nutrients: {
        calories: 380,
        protein: '25g',
        carbs: '40g',
        fat: '12g',
      },
      image: require('../assets/lunch.png'),
      icon: 'wb-twighlight', // Midday icon
    },
    snack: {
      title: 'Snack',
      time: '3:30 PM',
      meal: 'Apple slices with peanut butter',
      description: 'Sliced apple with a tablespoon of natural peanut butter.',
      nutrients: {
        calories: 180,
        protein: '4g',
        carbs: '22g',
        fat: '9g',
      },
      image: require('../assets/snack.png'),
      icon: 'wb-cloudy', // Afternoon icon
    },
    dinner: {
      title: 'Dinner',
      time: '7:00 PM',
      meal: 'Fish with sweet potatoes',
      description: 'Baked fish with mashed sweet potatoes and steamed broccoli.',
      nutrients: {
        calories: 390,
        protein: '28g',
        carbs: '35g',
        fat: '14g',
      },
      image: require('../assets/dinner.png'),
      icon: 'nights-stay', // Evening icon
    },
  };

  // Weekly meal plans
  const weeklyMealPlans = {
    1: { // Monday
      breakfast: {
        title: 'Breakfast',
        time: '7:00 AM',
        meal: 'Oatmeal with fruits',
        nutrients: { calories: 320, protein: '8g', carbs: '58g', fat: '6g' },
        image: require('../assets/breakfast.png'),
        icon: 'wb-sunny',
      },
      lunch: {
        title: 'Lunch',
        time: '12:30 PM',
        meal: 'Chicken and vegetable soup',
        nutrients: { calories: 380, protein: '25g', carbs: '40g', fat: '12g' },
        image: require('../assets/lunch.png'),
        icon: 'wb-twighlight',
      },
      // other meals for Monday
    },
    2: { // Tuesday
      breakfast: {
        title: 'Breakfast',
        time: '7:00 AM',
        meal: 'Whole grain toast with avocado',
        nutrients: { calories: 290, protein: '6g', carbs: '42g', fat: '14g' },
        image: require('../assets/breakfast.png'),
        icon: 'wb-sunny',
      },
      lunch: {
        title: 'Lunch',
        time: '12:30 PM',
        meal: 'Turkey wrap with vegetables',
        nutrients: { calories: 350, protein: '22g', carbs: '35g', fat: '15g' },
        image: require('../assets/lunch.png'),
        icon: 'wb-twighlight',
      },
      // other meals for Tuesday
    },
    // Data for other days of the week (3-7)
  };

  const MealCard = ({ meal }) => {
    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View>
            <Text style={styles.mealTitle}>{meal.title}</Text>
            <View style={styles.timeContainer}>
              <MaterialIcons name={meal.icon} size={14} color="#666666" />
              <Text style={styles.mealTime}> {meal.time}</Text>
            </View>
          </View>
          <Image source={meal.image} style={styles.mealImage} resizeMode="cover" />
        </View>
        
        <Text style={styles.mealName}>{meal.meal}</Text>
        <Text style={styles.mealDescription}>{meal.description}</Text>
        
        <View style={styles.nutrientsContainer}>
          <View style={styles.nutrientItem}>
            <MaterialIcons name="whatshot" size={16} color="#333333" style={styles.nutrientIcon} />
            <Text style={styles.nutrientValue}>{meal.nutrients.calories}</Text>
            <Text style={styles.nutrientLabel}>Calories</Text>
          </View>
          <View style={styles.nutrientItem}>
            <MaterialCommunityIcons name="food-steak" size={16} color="#333333" style={styles.nutrientIcon} />
            <Text style={styles.nutrientValue}>{meal.nutrients.protein}</Text>
            <Text style={styles.nutrientLabel}>Protein</Text>
          </View>
          <View style={styles.nutrientItem}>
            <MaterialCommunityIcons name="bread-slice" size={16} color="#333333" style={styles.nutrientIcon} />
            <Text style={styles.nutrientValue}>{meal.nutrients.carbs}</Text>
            <Text style={styles.nutrientLabel}>Carbs</Text>
          </View>
          <View style={styles.nutrientItem}>
            <MaterialCommunityIcons name="oil" size={16} color="#333333" style={styles.nutrientIcon} />
            <Text style={styles.nutrientValue}>{meal.nutrients.fat}</Text>
            <Text style={styles.nutrientLabel}>Fat</Text>
          </View>
        </View>
      </View>
    );
  };

  const DaySelector = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const date = new Date();
    const today = date.getDay() || 7; // Convert Sunday from 0 to 7 for our 1-7 index
    
    return (
      <View style={styles.daySelectorContainer}>
        {days.map((day, index) => {
          const dayIndex = index + 1; // 1-7 for Mon-Sun
          const isToday = today === dayIndex;
          const isSelected = selectedDay === dayIndex;
          const dayDate = new Date();
          dayDate.setDate(date.getDate() - (today - dayIndex));
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayItem,
                isToday && styles.todayItem,
                isSelected && !isToday && styles.selectedDayItem
              ]}
              onPress={() => setSelectedDay(dayIndex)}
            >
              <Text 
                style={[
                  styles.dayText,
                  (isToday || isSelected) && styles.todayText
                ]}
              >
                {day}
              </Text>
              <Text 
                style={[
                  styles.dateText,
                  (isToday || isSelected) && styles.todayText
                ]}
              >
                {dayDate.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Add a new CustomizeModal component
  const CustomizeModal = () => {
    const [tempWaterIntake, setTempWaterIntake] = useState(waterIntake);
    const [selectedDiet, setSelectedDiet] = useState('balanced');
    
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Customize Nutrition Plan</Text>
          
          <Text style={styles.modalSectionTitle}>Dietary Preferences</Text>
          <View style={styles.dietOptions}>
            {['Balanced', 'Vegetarian', 'High Protein', 'Low Carb'].map((diet) => (
              <TouchableOpacity 
                key={diet}
                style={[
                  styles.dietOption,
                  selectedDiet === diet.toLowerCase().replace(' ', '-') && styles.selectedDietOption
                ]}
                onPress={() => setSelectedDiet(diet.toLowerCase().replace(' ', '-'))}
              >
                <Text style={[
                  styles.dietOptionText,
                  selectedDiet === diet.toLowerCase().replace(' ', '-') && styles.selectedDietText
                ]}>{diet}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.modalSectionTitle}>Daily Water Target (glasses)</Text>
          <View style={styles.waterSelector}>
            <TouchableOpacity 
              style={styles.waterButton}
              onPress={() => tempWaterIntake > 1 && setTempWaterIntake(tempWaterIntake - 1)}
            >
              <Text style={styles.waterButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.waterDisplay}>
              {[...Array(8)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.waterGlass,
                    i < tempWaterIntake ? styles.filledWaterGlass : styles.emptyWaterGlass
                  ]}
                />
              ))}
              <Text style={styles.waterCount}>{tempWaterIntake}</Text>
            </View>
            <TouchableOpacity 
              style={styles.waterButton}
              onPress={() => tempWaterIntake < 8 && setTempWaterIntake(tempWaterIntake + 1)}
            >
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCustomizeModal(false)}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name="close" size={16} color="#333333" />
                <Text style={styles.cancelButtonText}> Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => {
                setWaterIntake(tempWaterIntake);
                setShowCustomizeModal(false);
              }}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name="check" size={16} color="white" />
                <Text style={styles.saveButtonText}> Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={19} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Plan</Text>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowCustomizeModal(true)}
        >
          <MaterialIcons name="settings" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>Weekly Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>Recipes</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'today' ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Daily Summary</Text>
            <View style={styles.summaryItems}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>1270</Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>65g</Text>
                <Text style={styles.summaryLabel}>Protein</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>155g</Text>
                <Text style={styles.summaryLabel}>Carbs</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>41g</Text>
                <Text style={styles.summaryLabel}>Fat</Text>
              </View>
            </View>
          </View>

          <View style={styles.waterTrackerContainer}>
            <View style={styles.waterTrackerHeader}>
              <Text style={styles.waterTrackerTitle}>Water Intake</Text>
              <Text style={styles.waterTrackerSubtitle}>{waterIntake} of 8 glasses</Text>
            </View>
            <View style={styles.waterGlassesContainer}>
              {[...Array(8)].map((_, i) => (
                <TouchableOpacity 
                  key={i}
                  onPress={() => setWaterIntake(i + 1)}
                  style={styles.waterGlassWrapper}
                >
                  {i < waterIntake ? (
                    <MaterialCommunityIcons name="cup-water" size={28} color="#20C997" />
                  ) : (
                    <MaterialCommunityIcons name="cup-outline" size={28} color="#E0E0E0" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.mealsContainer}>
            <MealCard meal={mealPlan.breakfast} />
            <MealCard meal={mealPlan.lunch} />
            <MealCard meal={mealPlan.snack} />
            <MealCard meal={mealPlan.dinner} />
          </View>
        </ScrollView>
      ) : activeTab === 'weekly' ? (
        <ScrollView style={styles.scrollView}>
          <DaySelector />
          <View style={styles.weeklyHeaderContainer}>
            <Text style={styles.weeklyTitle}>
              {['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][selectedDay]}
            </Text>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={18} color="#20C997" />
              <Text style={styles.editButtonText}> Edit Plan</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Daily Summary</Text>
            <View style={styles.summaryItems}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>1270</Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>65g</Text>
                <Text style={styles.summaryLabel}>Protein</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>155g</Text>
                <Text style={styles.summaryLabel}>Carbs</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>41g</Text>
                <Text style={styles.summaryLabel}>Fat</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.mealsContainer}>
            {weeklyMealPlans[selectedDay] ? (
              Object.values(weeklyMealPlans[selectedDay]).map((meal, index) => (
                <MealCard key={index} meal={meal} />
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons name="restaurant" size={80} color="#E0E0E0" />
                <Text style={styles.emptyStateText}>No meal plan created for this day yet</Text>
                <TouchableOpacity style={styles.createPlanButton}>
                  <Text style={styles.createPlanText}>Create Plan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.recipesTitle}>Healthy Recipes</Text>
          <Text style={styles.recipesDescription}>
            Browse nutritious recipes specifically designed for your child's needs.
          </Text>
          
          <View style={styles.recipesSearchContainer}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color="#999999" style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>Search recipes...</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {[
                { name: 'All', icon: 'apps' },
                { name: 'Breakfast', icon: 'free-breakfast' },
                { name: 'Lunch', icon: 'restaurant' },
                { name: 'Snacks', icon: 'cookie' },
                { name: 'Dinner', icon: 'dining' },
                { name: 'Desserts', icon: 'icecream' },
              ].map((category) => (
                <TouchableOpacity key={category.name} style={styles.categoryChip}>
                  <MaterialIcons name={category.icon} size={16} color="#333333" style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.recipesList}>
            {[
              {
                name: 'Fruit Yogurt Parfait',
                time: '10 min',
                difficulty: 'Easy',
                image: require('../assets/breakfast.png'),
              },
              {
                name: 'Veggie Pasta Bowl',
                time: '25 min',
                difficulty: 'Medium',
                image: require('../assets/lunch.png'),
              },
              {
                name: 'Baked Apple Slices',
                time: '15 min',
                difficulty: 'Easy',
                image: require('../assets/snack.png'),
              },
            ].map((recipe, index) => (
              <TouchableOpacity key={index} style={styles.recipeCard}>
                <Image source={recipe.image} style={styles.recipeImage} resizeMode="cover" />
                <View style={styles.recipeContent}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <View style={styles.recipeMetadata}>
                    <View style={styles.recipeMetaItemContainer}>
                      <MaterialIcons name="timer" size={16} color="#666666" />
                      <Text style={styles.recipeMetaItem}> {recipe.time}</Text>
                    </View>
                    <View style={styles.recipeMetaItemContainer}>
                      <MaterialIcons name="equalizer" size={16} color="#666666" />
                      <Text style={styles.recipeMetaItem}> {recipe.difficulty}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {showCustomizeModal && <CustomizeModal />}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'JakartaSans-Bold',
  },
  menuButton: {
    padding: 5,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'JakartaSans-Regular',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#20C997',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'JakartaSans-Regular',
  },
  activeTabText: {
    color: '#20C997',
    fontFamily: 'JakartaSans-Bold',
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    margin: 15,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 15,
    fontFamily: 'JakartaSans-Bold',
  },
  summaryItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    color: '#20C997',
    marginBottom: 5,
    fontFamily: 'JakartaSans-Bold',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'JakartaSans-Regular',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  mealsContainer: {
    padding: 15,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mealTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 5,
    fontFamily: 'JakartaSans-Bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTime: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'JakartaSans-Regular',
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mealName: {
    fontSize: 16,
    color: '#20C997',
    marginBottom: 10,
    fontFamily: 'JakartaSans-Bold',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: 'JakartaSans-Regular',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientIcon: {
    marginBottom: 5,
  },
  nutrientValue: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
    fontFamily: 'JakartaSans-Bold',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'JakartaSans-Regular',
  },
  // Continue updating all other text styles similarly
  dayText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    fontFamily: 'JakartaSans-Bold',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'JakartaSans-Regular',
  },
  todayText: {
    color: '#FFFFFF',
    fontFamily: 'JakartaSans-Bold',
  },
  weeklyDescription: {
    padding: 15,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'JakartaSans-Regular',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'JakartaSans-Regular',
  },
  recipesTitle: {
    fontSize: 20,
    color: '#333333',
    padding: 15,
    paddingBottom: 5,
    fontFamily: 'JakartaSans-Bold',
  },
  recipesDescription: {
    padding: 15,
    paddingTop: 5,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'JakartaSans-Regular',
  },
  modalTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'JakartaSans-Bold',
  },
  modalSectionTitle: {
    fontSize: 16,
    color: '#333333',
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'JakartaSans-Bold',
  },
  dietOptionText: {
    color: '#333333',
    fontFamily: 'JakartaSans-Regular',
  },
  selectedDietText: {
    color: 'white',
    fontFamily: 'JakartaSans-Bold',
  },
  waterButtonText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'JakartaSans-Bold',
  },
  waterCount: {
    fontSize: 18,
    color: '#333333',
    marginLeft: 10,
    fontFamily: 'JakartaSans-Bold',
  },
  cancelButtonText: {
    color: '#333333',
    fontFamily: 'JakartaSans-Bold',
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'JakartaSans-Bold',
  },
  waterTrackerTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'JakartaSans-Bold',
  },
  waterTrackerSubtitle: {
    fontSize: 14,
    color: '#20C997',
    fontFamily: 'JakartaSans-Bold',
  },
  searchPlaceholder: {
    color: '#999999',
    fontSize: 14,
    fontFamily: 'JakartaSans-Regular',
  },
  categoryText: {
    color: '#333333',
    fontSize: 14,
    fontFamily: 'JakartaSans-Regular',
  },
  recipeName: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'JakartaSans-Bold',
  },
  recipeMetaItem: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'JakartaSans-Regular',
  },
  // Modal styles
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dietOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dietOption: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: '48%',
    alignItems: 'center',
  },
  selectedDietOption: {
    backgroundColor: '#20C997',
  },
  
  // Water selector styles
  waterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  waterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  waterGlass: {
    width: 20,
    height: 30,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  emptyWaterGlass: {
    backgroundColor: '#F0F0F0',
  },
  filledWaterGlass: {
    backgroundColor: '#20C997',
  },
  
  // Modal button styles
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#20C997',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Water tracker styles for main screen
  waterTrackerContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
  },
  waterTrackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  waterGlassesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  waterGlassWrapper: {
    alignItems: 'center',
    padding: 5,
  },
  
  // Day selector styles
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F9F9F9',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 60,
    borderRadius: 20,
    padding: 5,
  },
  todayItem: {
    backgroundColor: '#20C997',
  },
  
  // Recipe styles
  recipesSearchContainer: {
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryIcon: {
    marginRight: 5,
  },
  recipesList: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: '100%',
    height: 150,
  },
  recipeContent: {
    padding: 15,
  },
  recipeMetadata: {
    flexDirection: 'row',
    marginTop: 8,
  },
  recipeMetaItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  selectedDayItem: {
    backgroundColor: '#71D9B3', // Lighter shade of the primary green
  },
  weeklyHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
  },
  weeklyTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'JakartaSans-Bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#20C997',
    fontSize: 14,
    fontFamily: 'JakartaSans-Medium',
  },
  createPlanButton: {
    backgroundColor: '#20C997',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  createPlanText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'JakartaSans-Bold',
  },
  
  // Empty state
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
});

export default NutritionPlanScreen;