import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

const CommunityScreen = () => {
  const discussions = [
    {
      id: '1',
      user: 'Sarah Johnson',
      avatar: require('../assets/snack.png'),
      time: '2 hours ago',
      content: 'My toddler is a picky eater. Any tips to get him to try new vegetables?',
      comments: 8,
      likes: 12
    },
    {
      id: '2',
      user: 'Michael Lee',
      avatar: require('../assets/snack.png'),
      time: '5 hours ago',
      content: 'Just had our 18-month checkup. Doctor suggested adding more dairy and protein to diet. Any meal suggestions?',
      comments: 3,
      likes: 5
    },
    {
      id: '3',
      user: 'Amanda Rodriguez',
      avatar: require('../assets/snack.png'),
      time: 'Yesterday',
      content: 'How often are you all measuring height/weight? Monthly or quarterly?',
      comments: 15,
      likes: 7
    }
  ];

  const renderDiscussionCard = (discussion) => (
    <View key={discussion.id} style={styles.discussionCard}>
      <View style={styles.discussionHeader}>
        <View style={styles.userInfo}>
          <Image source={discussion.avatar} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{discussion.user}</Text>
            <Text style={styles.timeAgo}>{discussion.time}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.discussionContent}>{discussion.content}</Text>
      
      <View style={styles.discussionActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="comment" size={18} color="#666666" />
          <Text style={styles.actionText}>{discussion.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="favorite-border" size={18} color="#666666" />
          <Text style={styles.actionText}>{discussion.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="share" size={18} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity>
          <MaterialIcons name="notifications-none" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>My Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Popular</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.createPostContainer}>
            <Image source={require('../assets/snack.png')} style={styles.userAvatar} />
            <TextInput
              style={styles.postInput}
              placeholder="Ask a question or share your experience..."
              placeholderTextColor="#999999"
            />
            <TouchableOpacity style={styles.postButton}>
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.discussionsContainer}>
            {discussions.map(discussion => renderDiscussionCard(discussion))}
            
            <TouchableOpacity style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <TouchableOpacity style={styles.fabButton}>
          <MaterialIcons name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#20C997',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  activeTabText: {
    color: '#20C997',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  createPostContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  postButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#20C997',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  discussionsContainer: {
    padding: 15,
    paddingBottom: 80, // Add extra padding at the bottom to account for FAB
  },
  discussionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#999999',
  },
  discussionContent: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
    lineHeight: 20,
    marginBottom: 15,
  },
  discussionActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  loadMoreButton: {
    alignItems: 'center',
    padding: 10,
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#20C997',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
});

export default CommunityScreen;