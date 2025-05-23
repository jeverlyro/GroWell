import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Button } from '../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  });

  React.useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    setIsValid(emailRegex.test(email) && password.length >= 6);
  }, [email, password]);

  const handleSignIn = () => {
    if (isValid) {
      navigation.navigate('MainApp');
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
          <View style={styles.SItitle}>
            <Text style={styles.title}>Sign <Text style={styles.greenText}>In</Text></Text>
          </View>
          <Text style={styles.subtitle}>Welcome back! Let's sign in to your account.</Text>

      
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email here"
              placeholderTextColor="#B5B5B5"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#B5B5B5"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <MaterialIcons 
                  name={isPasswordVisible ? "visibility" : "visibility-off"} 
                  size={22} color="#B5B5B5" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.options}>
              <View style={styles.checkboxContainer}>
                <CheckBox 
                  checked={isChecked}
                  onPress={() => setIsChecked(!isChecked)}
                  containerStyle={styles.checkboxWrapper}
                  checkedColor='#16C47F'
                  size={18}
                />
              <Text style={styles.rememberMeText}>Remember me</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EmailConfirmation')}>
                <Text style={styles.optionText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            
            <Button title="Sign In" onPress={handleSignIn} disabled={!isValid} style={styles.button} />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('GetStarted')}>
                <Text style={[styles.signupText, styles.greenText1]}>Sign Up</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 56,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginLeft: -5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#202020',
    marginTop: 20,
    marginVertical: 30,
  },
  SItitle:{},
  greenText: {
    fontSize: 56,
    color: '#16C47F',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  greenText1: {
    fontSize: 12,
    color: '#16C47F',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#000000',
    marginTop: 15,
  },
  input: {
    fontFamily: 'PlusJakartaSans-Regular',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxWrapper: {
    marginTop: 3,
    padding: 0,
    margin: 0,
    marginLeft: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  rememberMeText: {
    fontSize: 12,
    color: '#202020', 
    fontFamily: 'PlusJakartaSans-Regular',
  },
  optionText: {
    fontSize: 12,
    color: '#202020',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  button: {
    marginTop: 36,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    marginTop: 30,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  contactText: {
    color: '#16C47F',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});

export default SignInScreen;
