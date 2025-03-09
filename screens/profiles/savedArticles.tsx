import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Mock data for saved articles
const mockSavedArticles = [
  {
    id: '1',
    title: 'Healthy Eating Habits for Toddlers',
    category: 'Nutrition',
    date: '2 days ago',
    readTime: '5 min read',
    image: require('../../assets/snack.png'),
  },
  {
    id: '2',
    title: 'Supporting Your Child\'s Cognitive Development',
    category: 'Child Development',
    date: '1 week ago',
    readTime: '8 min read',
    image: require('../../assets/snack.png'),
  },
  {
    id: '3',
    title: 'Sleep Routines for Growing Children',
    category: 'Health',
    date: '2 weeks ago',
    readTime: '6 min read',
    image: require('../../assets/snack.png'),
  },
  {
    id: '4',
    title: 'The Importance of Physical Activity for Children',
    category: 'Physical Health',
    date: '3 weeks ago',
    readTime: '7 min read',
    image: require('../../assets/snack.png'),
  },
];

const SavedArticlesScreen = ({ navigation }) => {
  const [savedArticles, setSavedArticles] = useState(mockSavedArticles);

  const removeArticle = (id) => {
    setSavedArticles(savedArticles.filter(article => article.id !== id));
  };

  const renderArticleItem = ({ item }) => (
    <View style={styles.articleCard}>
      <Image source={item.image} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <View style={styles.articleMeta}>
          <Text style={styles.metaText}>{item.date}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{item.readTime}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.bookmarkButton}
        onPress={() => removeArticle(item.id)}
      >
        <MaterialIcons name="bookmark" size={24} color="#20C997" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={19} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Articles</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {savedArticles.length > 0 ? (
        <FlatList
          data={savedArticles}
          renderItem={renderArticleItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="bookmark-border" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No saved articles</Text>
          <Text style={styles.emptyText}>
            Articles you save will appear here for easy access.
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Articles</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  listContainer: {
    padding: 16,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  articleContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryContainer: {
    backgroundColor: '#F1FCF9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryText: {
    color: '#20C997',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  articleTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  metaDot: {
    fontSize: 12,
    marginHorizontal: 4,
    color: '#666666',
  },
  bookmarkButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#20C997',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#FFFFFF',
  },
});

export default SavedArticlesScreen;