import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

const EducationalContentScreen = () => {
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {articles.map(article => renderArticleCard(article))}
        </View>
        
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
  scrollView: {
    flex: 1,
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
  }
});

export default EducationalContentScreen;