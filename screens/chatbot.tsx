import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  Alert,
  ScrollView as RNScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: "#20C997",
  secondary: "#6C757D",
  dark: "#343A40",
  light: "#F8F9FA",
  mediumGray: "#ADB5BD",
  white: "#FFFFFF",
  black: "#000000",
};

const TypingIndicator = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);

    return () => {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    };
  }, []);

  return (
    <View style={styles.typingContainer}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.typingDot,
            {
              transform: [
                {
                  translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [recommendations, setRecommendations] = useState([
    "What foods can help improve my sleep?",
    "How can I reduce stress naturally?",
    "What exercises are best for beginners?",
    "How much water should I drink daily?",
    "What are signs of vitamin deficiency?",
  ]);
  const scrollViewRef = useRef();
  const recommendationsScrollRef = useRef();

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
    loadServerChatHistory();
    createNewChat();
  }, []);

  // Load all saved chats
  const loadChatHistory = async () => {
    try {
      const historyString = await AsyncStorage.getItem('chatHistory');
      if (historyString) {
        const history = JSON.parse(historyString);
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save current chat to history
  const saveChatToHistory = async () => {
    if (!currentChatId || messages.length === 0) return;
    
    try {
      const updatedChat = {
        id: currentChatId,
        timestamp: new Date().toISOString(),
        preview: messages[0]?.text.substring(0, 30) + '...',
        messages: [...messages],
      };
      
      const updatedHistory = [...chatHistory.filter(chat => chat.id !== currentChatId), updatedChat];
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      setChatHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  // Create a new chat session
  const createNewChat = async () => {
    setMessages([]);
    
    try {
      // Use MongoDB ID format when user is logged in
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        // Generate a timestamp-based ID similar to MongoDB's format
        const timestamp = Math.floor(Date.now() / 1000).toString(16);
        const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
        const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        
        const newId = timestamp + machineId + processId + counter;
        setCurrentChatId(newId);
      } else {
        // Fall back to timestamp for non-logged in users
        setCurrentChatId(Date.now().toString());
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      // Fallback to timestamp ID
      setCurrentChatId(Date.now().toString());
    }
  };

  // Load a specific chat from history
  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setHistoryModalVisible(false);
    }
  };

  // Delete the current chat
  const deleteCurrentChat = async () => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const updatedHistory = chatHistory.filter(chat => chat.id !== currentChatId);
              await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
              setChatHistory(updatedHistory);
              createNewChat();
            } catch (error) {
              console.error('Error deleting chat:', error);
            }
          }
        }
      ]
    );
  };

  // Modified handleSend to save chat after sending a message
  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText, sender: "user" };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputText("");
      setLoading(true);
  
      try {
        // Get user ID from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        
        // Send message to backend with userId
        const response = await axios.post("http://192.168.18.231:3001/chat", {
          message: inputText,
          userId: userId || currentChatId // Use currentChatId as fallback
        });
        
        const botMessage = { text: response.data.response, sender: "bot" };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, botMessage];
          // Save chat with the updated messages
          setTimeout(() => {
            saveChatToHistory();
          }, 100);
          return newMessages;
        });
      } catch (error) {
        console.error("Error communicating with the backend:", error);
        const errorMessage = {
          text: "Sorry, there was an error processing your request.",
          sender: "bot",
        };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, errorMessage];
          setTimeout(() => {
            saveChatToHistory();
          }, 100);
          return newMessages;
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const loadServerChatHistory = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('No user ID found');
        return;
      }
      
      const response = await axios.get(`http://192.168.217.219:3001/chat-history/${userId}`);
      
      if (response.data.history && response.data.history.length > 0) {
        // Convert server history format to app format
        const serverHistory = response.data.history.map(item => ({
          id: item._id, // Use MongoDB's _id as the chat ID
          timestamp: item.timestamp,
          preview: item.message.substring(0, 30) + (item.message.length > 30 ? '...' : ''),
          messages: [
            { text: item.message, sender: "user" },
            { text: item.response, sender: "bot" }
          ]
        }));
        
        // Load existing local history
        const localHistoryString = await AsyncStorage.getItem('chatHistory');
        const localHistory = localHistoryString ? JSON.parse(localHistoryString) : [];
        
        // Merge histories, preferring server history for duplicates
        // Create a map of existing IDs to avoid duplicates
        const existingIds = new Set(localHistory.map(chat => chat.id));
        
        // Add server history items that don't exist locally
        const mergedHistory = [...localHistory];
        for (const serverChat of serverHistory) {
          if (!existingIds.has(serverChat.id)) {
            mergedHistory.push(serverChat);
          }
        }
        
        // Update AsyncStorage and state
        await AsyncStorage.setItem('chatHistory', JSON.stringify(mergedHistory));
        setChatHistory(mergedHistory);
      }
    } catch (error) {
      console.error('Error loading server chat history:', error);
      // Load local history as fallback if server fails
      loadChatHistory();
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  // Handle recommendation selection
  const handleRecommendationPress = (recommendation) => {
    setInputText(recommendation);
  };

  // Load recommended prompts based on context
  const updateRecommendations = () => {
    // In a real app, you might want to update these based on conversation context
    // or fetch from an API
    const defaultRecommendations = [
      "What foods can help improve my child growth ?",
      "What exercises are best for children?",
      "How much water should my child drink daily?",
      "What are signs of vitamin deficiency?",
    ];
    
    setRecommendations(defaultRecommendations);
  };

  // Update recommendations when messages change
  useEffect(() => {
    updateRecommendations();
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.placeholder}></View>
        <Text style={styles.headerTitle}>Grow AI</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setHistoryModalVisible(true)}
          >
            <Ionicons name="time-outline" size={17} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={createNewChat}
          >
            <Ionicons name="add" size={20} color={COLORS.dark} />
          </TouchableOpacity>
          {messages.length > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={deleteCurrentChat}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.dark} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.chatContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <Text style={styles.emptyChat}>Ask me anything about health!</Text>
        )}
        
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubbleContainer,
              message.sender === "user" ? styles.userBubbleContainer : styles.botBubbleContainer,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  message.sender === "user" ? styles.userMessageText : null
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        
        {loading && (
          <View style={styles.botBubbleContainer}>
            <View style={[styles.messageBubble, styles.botBubble, styles.loadingBubble]}>
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Recommendations section */}
      <View style={styles.recommendationsContainer}>
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={recommendationsScrollRef}
          contentContainerStyle={styles.recommendationsContent}
        >
          {recommendations.map((recommendation, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendationBubble}
              onPress={() => handleRecommendationPress(recommendation)}
            >
              <Text style={styles.recommendationText} numberOfLines={2}>
                {recommendation}
              </Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.mediumGray}
          multiline
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.disabledButton]} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Chat History Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={historyModalVisible}
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chat History</Text>
              <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            
            {chatHistory.length === 0 ? (
              <Text style={styles.emptyHistory}>No chat history found</Text>
            ) : (
              <FlatList
                data={chatHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.historyItem}
                    onPress={() => loadChat(item.id)}
                  >
                    <View>
                      <Text style={styles.historyItemPreview}>{item.preview}</Text>
                      <Text style={styles.historyItemDate}>
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.dark,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 72,
    justifyContent: 'flex-end',
  },
  backButton: {
    width: 30,
  },
  placeholder: {
    width: 72,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  emptyChat: {
    textAlign: 'center',
    color: COLORS.mediumGray,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 40,
    fontSize: 16,
  },
  messageBubbleContainer: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  userBubbleContainer: {
    alignSelf: "flex-end",
  },
  botBubbleContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    minHeight: 40,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 4,
  },
  loadingBubble: {
    padding: 10,
    paddingHorizontal: 15,
  },
  messageText: {
    color: COLORS.dark,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
  },
  userMessageText: {
    color: COLORS.white,
    fontFamily: "PlusJakartaSans-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    padding: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  disabledButton: {
    backgroundColor: COLORS.mediumGray,
  },
  typingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.mediumGray,
    marginHorizontal: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: COLORS.dark,
  },
  emptyHistory: {
    textAlign: 'center',
    color: COLORS.mediumGray,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 30,
    marginBottom: 30,
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemPreview: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: COLORS.dark,
    marginBottom: 5,
  },
  historyItemDate: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: COLORS.mediumGray,
  },
  headerButton: {
    padding: 5,
  },
  recommendationsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  recommendationsContent: {
    paddingRight: 10,
  },
  recommendationBubble: {
    backgroundColor: COLORS.light,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    maxWidth: 180,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  recommendationText: {
    color: COLORS.dark,
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
  },
});

export default ChatbotScreen;
