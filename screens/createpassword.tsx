import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform
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
  });

  React.useEffect(() => {
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 6;
    setIsValid(isLongEnough && hasNumber && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleCreatePassword = () => {
    if (isValid) {
      navigation.navigate('Home');
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
        <View style={styles.innerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#1C1B1F" />
          </TouchableOpacity>
          <Text style={styles.title}>Create <Text style={styles.greenText}>Password</Text></Text>
          <Text style={styles.subtitle}>Your email is verified, now let's make a password for your account safety.</Text>

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
            <Text style={[styles.validationText, password.length >= 6 ? styles.valid : styles.invalid]}>✓ At least 6 characters</Text>
            <Text style={[styles.validationText, /\d/.test(password) ? styles.valid : styles.invalid]}>✓ Must contain at least 1 number</Text>
          </View>

          <Button title="Create & Sign In" onPress={handleCreatePassword} disabled={!isValid} style={styles.button} />
        </View>
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
  innerContainer: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  greenText: {
    color: '#16C47F',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#202020',
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
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
    marginTop: 10,
  },
  validationText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  button: {
    marginTop: 20,
  },
});

export default CreatePasswordScreen;