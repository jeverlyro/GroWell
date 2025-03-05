import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button } from '../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const GetStartedScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  });

  React.useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(name.trim().length > 0 && emailRegex.test(email));
  }, [name, email]);

  const handleSignUp = () => {
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={19} color="#333333" />
          </TouchableOpacity>

          <Text style={styles.title}>
            Getting <Text style={styles.greenText}>Started</Text>
          </Text>

          <Image 
            source={require('../assets/children.png')} 
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#AAAAAA"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#AAAAAA"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              disabled={!isValid}
              style={styles.button}
            />

            <Text style={styles.termsText}>
              By signing up, you agree to our Terms & 
              <Text style={styles.greenText}> Privacy Policy</Text>
            </Text>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginText, styles.greenText]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 48,
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333333',
  },
  greenText: {
    color: '#20C997',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  image: {
    width: '100%',
    height: 150,
    marginVertical: 20,
    alignSelf: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
  },
  input: {
    fontFamily: 'PlusJakartaSans-Regular',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    paddingHorizontal: 0,
    fontSize: 12,
    marginBottom: 25,
    color: '#333333',
  },
  button: {
    marginTop: 10,
  },
  termsText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666666',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});

export default GetStartedScreen;