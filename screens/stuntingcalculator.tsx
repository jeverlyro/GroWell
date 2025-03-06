import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/button';
import CircularProgress from 'react-native-circular-progress-indicator';
import Svg, { Circle, Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { analyzeStunting } from '../backend/services/stuntingService';

const NumericInput = React.memo(({ value, onChangeText, placeholder, style }) => {
  const handleChangeText = useCallback((text) => {
    // Only allow numeric input with decimal point
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (text === '' || numericRegex.test(text)) {
      onChangeText(text);
    }
  }, [onChangeText]);

  return (
    <TextInput
      style={style}
      value={value}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      placeholderTextColor="#BDBDBD"
      keyboardType="numeric"
      maxLength={6} // Reasonable limit for height/weight values
    />
  );
});

const StuntingCalculatorScreen = ({ navigation }) => {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [riskLevel, setRiskLevel] = useState(null);
  const [riskPercentage, setRiskPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [stuntingStatus, setStuntingStatus] = useState('');
  const [growthMetrics, setGrowthMetrics] = useState({});

  // Load Plus Jakarta Sans font
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  });

  const handleAgeChange = useCallback((text) => {
    // Only allow numeric input
    if (text === '' || /^[0-9]+$/.test(text)) {
      setAge(text);
    }
  }, []);

  const calculateRisk = useCallback(async () => {
    setIsLoading(true); // Show loading indicator
    
    try {
      const ageInMonths = parseInt(age);
      const heightInCm = parseFloat(height);
      const weightInKg = parseFloat(weight);
      
      // Call the API service
      const analysisResult = await analyzeStunting({
        childName,
        age: ageInMonths,
        gender,
        height: heightInCm,
        weight: weightInKg
      });
      
      // Update state based on API response
      setRiskLevel(analysisResult.result.risk_level);
      setRiskPercentage(analysisResult.result.risk_percentage);
      setAnalysisText(analysisResult.result.analysis);
      setRecommendations(analysisResult.result.recommendations);
      setStuntingStatus(analysisResult.result.stunting_status);
      setGrowthMetrics(analysisResult.result.growth_metrics);
      
      setShowResults(true);
    } catch (error) {
      console.error('Failed to analyze stunting risk:', error);
      Alert.alert(
        'Analysis Failed',
        'Unable to complete the stunting risk analysis. Please try again later.',
        [{ text: 'OK' }]
      );
      
      // Fallback calculation if the API fails
      const expectedHeight = gender === 'Male' ? 45 + (parseInt(age) * 0.5) : 44 + (parseInt(age) * 0.5);
      const heightForAgeZ = (parseFloat(height) - expectedHeight) / 5;
      
      if (heightForAgeZ < -3) {
        setRiskLevel('high');
        setRiskPercentage(85);
      } else if (heightForAgeZ < -2) {
        setRiskLevel('medium');
        setRiskPercentage(50);
      } else {
        setRiskLevel('low');
        setRiskPercentage(15);
      }
      
      setShowResults(true);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  }, [age, gender, height, weight, childName]);

  const isFormValid = useMemo(() => {
    return (
      childName.trim() !== '' &&
      age !== '' &&
      gender !== '' &&
      height !== '' &&
      weight !== ''
    );
  }, [childName, age, gender, height, weight]);

  const renderResults = () => {
    let resultColor = '#20C997'; // Green for low risk
    let resultText = 'Low Risk';
    let resultDescription = 'Your child appears to be growing well according to WHO standards.';
    let iconName = 'check-circle';
    
    if (riskLevel === 'medium') {
      resultColor = '#FFC107'; // Yellow for medium risk
      resultText = 'Medium Risk';
      resultDescription = 'Your child may be showing early signs of stunting. Follow the recommendations below.';
      iconName = 'alert-circle';
    } else if (riskLevel === 'high') {
      resultColor = '#FF4D4F'; // Red for high risk
      resultText = 'High Risk';
      resultDescription = 'Your child shows signs of stunting that require attention. Please consult a healthcare provider.';
      iconName = 'alert-triangle';
    }
  
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Analysis Results</Text>
        
        {/* Risk percentage display */}
        <View style={styles.circularProgressContainer}>
          <CircularProgress 
            value={riskPercentage} 
            radius={80} 
            duration={1000} 
            progressValueColor={resultColor}
            activeStrokeColor={resultColor}
            inActiveStrokeColor='#EEEEEE'
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={15}
            activeStrokeWidth={15}
          />
          <View style={styles.riskPercentageContainer}>
            <Text style={styles.riskPercentageText}>{riskPercentage}%</Text>
            <Text style={[styles.riskText, { color: resultColor }]}>{resultText}</Text>
          </View>
        </View>
        
        {/* Result summary card */}
        <View style={[styles.resultSummaryCard, { borderLeftColor: resultColor }]}>
          <Text style={styles.resultDescription}>{resultDescription}</Text>
        </View>
        
        {/* Child info section */}
        <Text style={styles.childInfoTitle}>Child Information</Text>
        <View style={styles.childInfoContainer}>
          <View style={styles.childInfoItem}>
            <Text style={styles.childInfoLabel}>Name:</Text>
            <Text style={styles.childInfoValue}>{childName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.childInfoItem}>
            <Text style={styles.childInfoLabel}>Age:</Text>
            <Text style={styles.childInfoValue}>{age} months</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.childInfoItem}>
            <Text style={styles.childInfoLabel}>Gender:</Text>
            <Text style={styles.childInfoValue}>{gender}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.childInfoItem}>
            <Text style={styles.childInfoLabel}>Height:</Text>
            <Text style={styles.childInfoValue}>{height} cm</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.childInfoItem}>
            <Text style={styles.childInfoLabel}>Weight:</Text>
            <Text style={styles.childInfoValue}>{weight} kg</Text>
          </View>
          {growthMetrics?.expected_height && (
            <>
              <View style={styles.divider} />
              <View style={styles.childInfoItem}>
                <Text style={styles.childInfoLabel}>Expected Height:</Text>
                <Text style={styles.childInfoValue}>{growthMetrics.expected_height} cm</Text>
              </View>
            </>
          )}
        </View>
        
        {/* AI Analysis section */}
        {analysisText && (
          <View style={styles.aiAnalysisContainer}>
            <Text style={styles.aiAnalysisTitle}>AI Analysis</Text>
            <Text style={styles.aiAnalysisText}>{analysisText}</Text>
          </View>
        )}
        
        {/* Recommendations section */}
        {recommendations && recommendations.length > 0 && (
          <>
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            <View style={styles.recommendationsCard}>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: resultColor }]} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        
        <Button
          title="Save Results"
          onPress={() => navigation.navigate('Home')}
          style={styles.saveButton}
        />
        
        <TouchableOpacity 
          style={styles.recalculateButton}
          onPress={() => {
            setShowResults(false);
            setRiskLevel(null);
          }}
        >
          <Text style={styles.recalculateText}>Re-calculate</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading fonts...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stunting Risk Calculator</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {!showResults ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Enter your child's information</Text>
            
            <Text style={styles.label}>Child's Name</Text>
            <TextInput
              style={styles.input}
              value={childName}
              onChangeText={setChildName}
              placeholder="Enter child's name"
              placeholderTextColor="#BDBDBD"
            />
            
            <Text style={styles.label}>Age (months)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={handleAgeChange}
              placeholder="Enter age in months"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
              maxLength={3} // Reasonable limit for age in months
            />
            
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'Male' && styles.selectedGender,
                ]}
                onPress={() => setGender('Male')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'Male' && styles.selectedGenderText,
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'Female' && styles.selectedGender,
                  { marginLeft: 10, marginRight: 0 }
                ]}
                onPress={() => setGender('Female')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'Female' && styles.selectedGenderText,
                ]}>Female</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Height (cm)</Text>
            <NumericInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter height in centimeters"
            />
            
            <Text style={styles.label}>Weight (kg)</Text>
            <NumericInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight in kilograms"
            />
            
            <Button
              title="Calculate Risk"
              onPress={calculateRisk}
              disabled={!isFormValid}
              style={styles.calculateButton}
            />
          </View>
        ) : renderResults()}
      </ScrollView>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#20C997" />
          <Text style={styles.loadingText}>Analyzing with AI...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  placeholder: {
    width: 30,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  label: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 22,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    backgroundColor: '#FFFFFF',
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  selectedGender: {
    backgroundColor: '#20C997',
    borderColor: '#20C997',
  },
  genderText: {
    color: '#555555',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  selectedGenderText: {
    color: '#FFFFFF',
  },
  calculateButton: {
    marginTop: 10,
    borderRadius: 10,
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
    alignSelf: 'flex-start',
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  riskPercentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskPercentageText: {
    fontSize: 38,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  riskText: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  resultSummaryCard: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
  resultDescription: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  childInfoTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  childInfoContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  childInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
    marginVertical: 6,
  },
  childInfoLabel: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  childInfoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  recommendationsTitle: {
    fontSize: 20,
    color: '#333333',
    marginTop: 8,
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-SemiBold',
    alignSelf: 'flex-start',
  },
  recommendationsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#20C997',
    marginRight: 12,
    marginTop: 8,
  },
  recommendationText: {
    fontSize: 16,
    color: '#555555',
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 24,
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 15,
    width: '100%',
    borderRadius: 10,
  },
  recalculateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#20C997',
  },
  recalculateText: {
    color: '#20C997',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
    marginBottom: 2,
  },
aiAnalysisContainer: {
  width: '100%',
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 10,
  marginVertical: 16,
  borderWidth: 1,
  borderColor: '#EEEEEE',
},
aiAnalysisTitle: {
  fontSize: 18,
  color: '#333333',
  marginBottom: 12,
  fontFamily: 'PlusJakartaSans-SemiBold',
},
aiAnalysisText: {
  fontSize: 16,
  color: '#555555',
  lineHeight: 24,
  fontFamily: 'PlusJakartaSans-Regular',
},
loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},
loadingText: {
  marginTop: 10,
  fontSize: 16,
  color: '#333333',
  fontFamily: 'PlusJakartaSans-Medium',
},
});

export default StuntingCalculatorScreen;