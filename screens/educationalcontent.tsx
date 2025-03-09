import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EducationalContentScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Header - matched with homescreen */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>GroWell Learn</Text>
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
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
          </View>
          
          {/* Category Filter Pills */}
          <View style={styles.categoriesSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
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
          </View>
          
          {/* Articles Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Articles</Text>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>See All</Text>
                <MaterialIcons name="chevron-right" size={16} color="#20C997" />
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
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>See All</Text>
                <MaterialIcons name="chevron-right" size={16} color="#20C997" />
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {videos.map(video => renderVideoCard(video))}
            </ScrollView>
          </View>
          
          {/* Quick Tips - styled like the Tip Card in homescreen */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Daily Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <MaterialIcons name="lightbulb" size={24} color="#20C997" />
                <Text style={styles.tipTitle}>Tip of the Day</Text>
              </View>
              <Text style={styles.tipText}>
                Include colorful vegetables in every meal to ensure your child gets essential nutrients.
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

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#20C997',
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
  },
  categoriesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  activeCategoryPill: {
    backgroundColor: '#20C997',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  section: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    paddingBottom: 8,
    color: '#333333',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    marginRight: 4,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
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
    fontSize: 15,
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
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#AAAAAA',
    marginTop: 10,
  },
  videosContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  videoCard: {
    width: 200,
    marginRight: 15,
  },
  videoImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
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
  tipsSection: {
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F6FFF8',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginLeft: 10,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555555',
    marginBottom: 12,
  },
});

export default EducationalContentScreen;