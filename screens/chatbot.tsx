import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const COLORS = {
  primary: "#20C997",
  secondary: "#6C757D",
  dark: "#343A40",
  light: "#F8F9FA",
  mediumGray: "#ADB5BD",
  white: "#FFFFFF",
  black: "#000000",
};

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText, sender: "user" };
      setMessages([...messages, userMessage]);
      setInputText("");
      setLoading(true);

      try {
        const response = await axios.post("http://10.0.2.2:3001/chat", {
          message: inputText,
        });
        const botMessage = { text: response.data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error communicating with the backend:", error);
        const errorMessage = {
          text: "Sorry, there was an error processing your request.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grow AI</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.mediumGray}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.dark,
  },
  placeholder: {
    width: 30,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: COLORS.light,
    alignSelf: "flex-start",
  },
  messageText: {
    color: COLORS.dark,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatbotScreen;
