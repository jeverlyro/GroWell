import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Button } from '../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

const EmailConfirmationScreen: React.FC = ({ navigation }) => {
  const [otp, setOtp] = useState<string>('');

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleOtpChange = (code: string) => {
    setOtp(code);
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      console.log('OTP submitted:', otp);
      navigation.navigate('CreatePassword');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoid}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Email Confirmation</Text>
          <Text style={styles.subtitle}>
            We’ve sent you a confirmation code to your email to </Text>
            <Text style={styles.subtitle1}>complete the verification process.
            </Text>

          <View style={styles.otpContainer}>
            {[...Array(6)].map((_, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => {
                  let newOtp = otp.split('');
                  newOtp[index] = text;
                  setOtp(newOtp.join(''));
                }}
                value={otp[index] || ''}
              />
            ))}
          </View>

          <TouchableOpacity>
            <Text style={styles.resendText}>
              Didn’t receive any code? <Text style={styles.resendLink}>Send again.</Text>
            </Text>
          </TouchableOpacity >
          
          <Button title="Submit" onPress={handleSubmit} disabled={otp.length !== 6} style={styles.button} />
        </View>
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
    justifyContent: 'center',
  },
  keyboardAvoid: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginTop: 120,
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#202020',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle1: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#202020',
    textAlign: 'center',
    marginTop:-25,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 50,
  },
  otpInput: {
    width: 55,
    height: 55,
    marginHorizontal: 5, 
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#EEEEEE',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: -20,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
    marginBottom: 64,
    
  },
  resendLink: {
    color: '#16C47F',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  button: {
    marginTop: 20,
    width: '100%',
    color: '#16C47F',
  },
});

export default EmailConfirmationScreen;
