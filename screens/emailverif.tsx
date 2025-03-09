import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Button } from '../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  EmailConfirmation: undefined;
  CreatePassword: undefined;
};

type EmailConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EmailConfirmation'>;
};

const EmailConfirmationScreen: React.FC<EmailConfirmationScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState<string>('');
  const inputRefs = useRef<Array<TextInput | null>>([]);

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

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = otp.split('');
    newOtp[index] = text;
    const updatedOtp = newOtp.join('');
    setOtp(updatedOtp);

    // Move to next input if current input is filled
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
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
            We've sent you a confirmation code to your email to complete the verification process.
          </Text>

          <View style={styles.otpContainer}>
            {[...Array(6)].map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
                value={otp[index] || ''}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>

            <Text style={styles.resendText}>
              Didn't receive any code? <TouchableOpacity><Text style={styles.resendLink}>Send again.</Text></TouchableOpacity>
            </Text>
          
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
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#202020',
    textAlign: 'center',
    marginVertical: 20,
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