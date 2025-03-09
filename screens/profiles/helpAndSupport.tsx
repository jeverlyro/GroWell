import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const HelpAndSupportScreen = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    // Validate fields
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject for your message');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send message
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Message Sent',
        'Your message has been sent successfully. We will get back to you shortly.',
        [{ text: 'OK', onPress: () => {
          setSubject('');
          setMessage('');
        }}]
      );
    }, 1500);
    
    // In a real app, you would send the message to your backend:
    // try {
    //   await api.sendSupportMessage({ subject, message });
    //   setIsLoading(false);
    //   Alert.alert('Message Sent', 'Your message has been sent successfully');
    //   setSubject('');
    //   setMessage('');
    // } catch (error) {
    //   setIsLoading(false);
    //   Alert.alert('Error', 'Failed to send message. Please try again later.');
    // }
  };

  const openFAQ = () => {
    // Navigate to FAQ screen or open website
    // navigation.navigate('FAQScreen');
    Alert.alert('FAQ', 'This feature will be available soon.');
  };

  const openEmail = () => {
    Linking.openURL('mailto:growell.team@example.com?subject=Support Request');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={19} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>
          <Text style={styles.sectionSubtitle}>
            Send us a message and we'll get back to you as soon as possible.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.inputLabel}>Subject</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Enter subject"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue or question..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (!subject.trim() || !message.trim()) && styles.disabledButton
            ]}
            onPress={handleSendMessage}
            disabled={isLoading || !subject.trim() || !message.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.sendButtonText}>Send Message</Text>
                <MaterialIcons name="send" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.alternativeSection}>
          <Text style={styles.alternativeTitle}>Other ways to get help</Text>
          
          <TouchableOpacity style={styles.optionCard} onPress={openFAQ}>
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="help-outline" size={22} color="#20C997" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Frequently Asked Questions</Text>
              <Text style={styles.optionDescription}>Find quick answers to common questions</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionCard} onPress={openEmail}>
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="email" size={22} color="#20C997" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Email Us</Text>
              <Text style={styles.optionDescription}>growell.team@example.com</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
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
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    lineHeight: 22,
  },
  contactSection: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  messageInput: {
    minHeight: 150,
    maxHeight: 300,
  },
  sendButton: {
    backgroundColor: '#20C997',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  alternativeSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: '#F5F5F5',
  },
  alternativeTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
});

export default HelpAndSupportScreen;