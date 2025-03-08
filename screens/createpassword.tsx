import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Button } from '../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const CreatePasswordScreen: React.FC = ({ navigation }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
  });

  React.useEffect(() => {
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    setIsValid(isLongEnough && hasNumber && passwordsMatch);
  }, [password, confirmPassword]);

  const handleCreatePassword = () => {
    if (isValid) {
      navigation.navigate('SignIn');
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={19} color="#1C1B1F" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create</Text>
            <Text style={styles.greenText}>Password</Text>
          </View>
          
          <Text style={styles.subtitle}>Your email is verified, now let's make a password for your account safety.</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#B5B5B5"
              secureTextEntry
            />

            <Text style={styles.label}>Retype Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Retype your password"
              placeholderTextColor="#B5B5B5"
              secureTextEntry
            />

            <View style={styles.validationContainer}>
              <Text style={[styles.validationText, password.length >= 8 ? styles.valid : styles.invalid]}>✓ At least 8 characters</Text>
              <Text style={[styles.validationText, /\d/.test(password) ? styles.valid : styles.invalid]}>✓ Must contain at least 1 number</Text>
              {confirmPassword.length > 0 && (
                <Text style={[styles.validationText, password === confirmPassword ? styles.valid : styles.invalid]}>✓ Passwords match</Text>
              )}
            </View>

            <Button title="Create & Sign In" onPress={handleCreatePassword} disabled={!isValid} style={styles.button} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 56,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#202020',
    marginBottom: -20,
    marginLeft: -5,
  },
  greenText: {
    color: '#16C47F',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 56,
    marginLeft: -5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#202020',
    marginVertical: 15,
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#000000',
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
  },
  validationContainer: {
    marginTop: 15,
  },
  validationText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    marginVertical: 2,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  button: {
    marginTop: 30,
  },
  contactText: {
    color: '#16C47F',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePasswordScreen;