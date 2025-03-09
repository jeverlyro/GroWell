import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DeleteAccountScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmStage, setConfirmStage] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteRequest = () => {
    if (!password) {
      Alert.alert("Error", "Please enter your password to confirm.");
      return;
    }
    
    // Move to confirmation stage
    setConfirmStage(true);
  };

  const handleFinalConfirmation = () => {
    if (confirmText !== 'DELETE') {
      Alert.alert("Error", "Please type DELETE to confirm account deletion.");
      return;
    }
    
    setIsDeleting(true);
    
    // Simulate account deletion process
    setTimeout(() => {
      setIsDeleting(false);
      Alert.alert(
        "Account Deleted",
        "Your account and all associated data have been scheduled for deletion. This process will be completed within 30 days.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    }, 2000);
  };

  const handleCancel = () => {
    if (confirmStage) {
      setConfirmStage(false);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Ionicons name="warning" size={60} color="#FF6B6B" style={styles.icon} />
          
          <Text style={styles.title}>Delete Your Account</Text>
          
          <Text style={styles.description}>
            We're sorry to see you go. Before you proceed, please understand that deleting your account 
            will permanently remove all your data from our systems and cannot be undone.
          </Text>
          
          {!confirmStage ? (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>What happens when you delete your account:</Text>
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>All your profile information will be permanently deleted</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>Your child growth records and history will be erased</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>All photos and media you've uploaded will be removed</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>You'll lose access to premium features if subscribed</Text>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Please enter your password to continue</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                
                <Text style={styles.formLabel}>Help us improve: Why are you leaving? (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us why you're deleting your account..."
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteRequest}
              >
                <Text style={styles.deleteButtonText}>Continue to Delete Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.infoCard, styles.warningCard]}>
                <Text style={styles.warningTitle}>Final Confirmation</Text>
                <Text style={styles.warningText}>
                  This action cannot be undone. All your data will be permanently deleted within 30 days.
                </Text>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>
                  Type DELETE to confirm account deletion
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Type DELETE"
                  placeholderTextColor="#999999"
                  value={confirmText}
                  onChangeText={setConfirmText}
                  autoCapitalize="characters"
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.deleteButton, styles.finalDeleteButton]}
                onPress={handleFinalConfirmation}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete My Account Permanently</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>I've Changed My Mind</Text>
              </TouchableOpacity>
            </>
          )}
          
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <TouchableOpacity>
              <Text style={styles.helpLink}>Contact our support team</Text>
            </TouchableOpacity>
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
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 25,
  },
  warningCard: {
    backgroundColor: '#FFF3F3',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
    lineHeight: 22,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginRight: 10,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
    lineHeight: 20,
  },
  formSection: {
    width: '100%',
    marginBottom: 25,
  },
  formLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
    marginBottom: 20,
    width: '100%',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  finalDeleteButton: {
    backgroundColor: '#FF3B3B',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  helpSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 5,
  },
  helpLink: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    textDecorationLine: 'underline',
  },
});

export default DeleteAccountScreen;