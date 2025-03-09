import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const EducationalContentScreen = () => {
  // Add state for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Development', 'Nutrition', 'Health'];

  const articles = [
    {
      id: '1',
      title: 'Understanding Child Growth Milestones',
      category: 'Development',
      minutes: 5,
      image: require('../assets/snack.png')
    },
    {
      id: '2',
      title: 'Nutrition Guidelines for Toddlers',
      category: 'Nutrition',
      minutes: 7,
      image: require('../assets/snack.png')
    },
    {
      id: '3',
      title: 'Preventing Stunting: Early Interventions',
      category: 'Health',
      minutes: 6,
      image: require('../assets/snack.png')
    }
  ];

  const videos = [
    {
      id: '1',
      title: 'Preparing Nutritious Meals for Kids',
      duration: '12:30',
      image: require('../assets/snack.png')
    },
    {
      id: '2',
      title: 'Child Development Activities',
      duration: '8:45',
      image: require('../assets/snack.png')
    }
  ];

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderArticleCard = (article) => (
    <TouchableOpacity key={article.id} style={styles.articleCard}>
      <Image source={article.image} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleCategory}>{article.category}</Text>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleMeta}>{article.minutes} min read</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVideoCard = (video) => (
    <TouchableOpacity key={video.id} style={styles.videoCard}>
      <View style={styles.videoImageContainer}>
        <Image source={video.image} style={styles.videoImage} />
        <View style={styles.playIconContainer}>
          <MaterialIcons name="play-circle-filled" size={40} color="#FFFFFF" />
        </View>
      </View>
      <Text style={styles.videoTitle}>{video.title}</Text>
      <Text style={styles.videoDuration}>{video.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#AAAAAA" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for topics..."
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Category Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(category => (
            <TouchableOpacity 
              key={category} 
              style={[
                styles.categoryPill, 
                activeCategory === category && styles.activeCategoryPill
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  activeCategory === category && styles.activeCategoryText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Articles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => renderArticleCard(article))
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialIcons name="search-off" size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>No articles found</Text>
            </View>
          )}
        </View>
        
        {/* Videos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Educational Videos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
            {videos.map(video => renderVideoCard(video))}
          </ScrollView>
        </View>
        
        {/* New Section: Quick Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Tips</Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <MaterialIcons name="lightbulb" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Tip of the Day</Text>
              <Text style={styles.tipText}>
                Include colorful vegetables in every meal to ensure your child gets essential nutrients.
              </Text>
            </View>
          </View>
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
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#20C997',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoriesContent: {
    alignItems: 'center',
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  activeCategoryPill: {
    backgroundColor: '#20C997',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 15,
  },
  articleCategory: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    marginBottom: 5,
  },
  articleTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  articleMeta: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  emptyStateContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#CCCCCC',
    marginTop: 10,
  },
  videosContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  videoCard: {
    width: 220,
    marginRight: 15,
  },
  videoImageContainer: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#20C997',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#666666',
  },
});

export default EducationalContentScreen;