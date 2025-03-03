import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NutritionPlanScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('today');
  
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
    },
  };

  const MealCard = ({ meal }) => {
    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View>
            <Text style={styles.mealTitle}>{meal.title}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
          <Image source={meal.image} style={styles.mealImage} resizeMode="cover" />
        </View>
        
        <Text style={styles.mealName}>{meal.meal}</Text>
        <Text style={styles.mealDescription}>{meal.description}</Text>
        
        <View style={styles.nutrientsContainer}>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientValue}>{meal.nutrients.calories}</Text>
            <Text style={styles.nutrientLabel}>Calories</Text>
          </View>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientValue}>{meal.nutrients.protein}</Text>
            <Text style={styles.nutrientLabel}>Protein</Text>
          </View>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientValue}>{meal.nutrients.carbs}</Text>
            <Text style={styles.nutrientLabel}>Carbs</Text>
          </View>
          <View style={styles.nutrientItem}>
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
    const today = date.getDay(); // 0 is Sunday
    
    return (
      <View style={styles.daySelectorContainer}>
        {days.map((day, index) => {
          const adjustedIndex = (index + 1) % 7; // Adjust to make Monday index 0
          const isToday = today === adjustedIndex || (today === 0 && adjustedIndex === 6);
          
          return (
            <View 
              key={index} 
              style={[
                styles.dayItem,
                isToday && styles.todayItem
              ]}
            >
              <Text 
                style={[
                  styles.dayText,
                  isToday && styles.todayText
                ]}
              >
                {day}
              </Text>
              <Text 
                style={[
                  styles.dateText,
                  isToday && styles.todayText
                ]}
              >
                {((date.getDate() - today) + adjustedIndex) % 30 + 1}
              </Text>
            </View>
          );
        })}
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
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Plan</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⋮</Text>
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
          <Text style={styles.weeklyDescription}>
            View and plan your child's nutrition for the entire week. Tap on a day to see detailed meal plans.
          </Text>
          
          {/* Weekly plan content would go here */}
          <View style={styles.emptyStateContainer}>
            <Image 
              source={require('../assets/calendar-icon.png')} 
              style={styles.emptyStateIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyStateText}>Select a day to view the meal plan</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.recipesTitle}>Healthy Recipes</Text>
          <Text style={styles.recipesDescription}>
            Browse nutritious recipes specifically designed for your child's needs.
          </Text>
          
          {/* Recipes content would go here */}
          <View style={styles.emptyStateContainer}>
            <Image 
              source={require('../assets/recipe-icon.png')} 
              style={styles.emptyStateIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyStateText}>Recipes coming soon!</Text>
          </View>
        </ScrollView>
      )}
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
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  menuButton: {
    padding: 5,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#333333',
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
  },
  activeTabText: {
    color: '#20C997',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
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
    fontWeight: 'bold',
    color: '#20C997',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
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
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  mealTime: {
    fontSize: 14,
    color: '#666666',
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#20C997',
    marginBottom: 10,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
    lineHeight: 20,
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
  nutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#666666',
  },
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  dayItem: {
    alignItems: 'center',
    width: 40,
    height: 60,
    justifyContent: 'center',
    borderRadius: 20,
  },
  todayItem: {
    backgroundColor: '#20C997',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  todayText: {
    color: '#FFFFFF',
  },
  weeklyDescription: {
    padding: 15,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: '#E0E0E0',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
  },
  recipesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    padding: 15,
    paddingBottom: 5,
  },
  recipesDescription: {
    padding: 15,
    paddingTop: 5,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default NutritionPlanScreen;