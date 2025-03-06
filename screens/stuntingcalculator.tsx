import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/button';
import CircularProgress from 'react-native-circular-progress-indicator';
import Svg, { Circle, Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { analyzeStunting } from '../backend/services/stuntingService';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

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
    
    // Gradient colors for background based on risk level
    const gradientColors = riskLevel === 'high' 
      ? ['#FFEFEF', '#FFF5F5'] 
      : riskLevel === 'medium' 
        ? ['#FFF9E6', '#FFFBF2'] 
        : ['#E6F8F3', '#F2FBFA'];
  
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Analysis Results</Text>
        
        {/* Risk percentage display */}
        <View style={styles.circularProgressContainer}>
          <CircularProgress 
            value={riskPercentage} 
            radius={90} 
            duration={1500}
            valueSuffix={'%'}
            progressValueColor={resultColor}
            activeStrokeColor={resultColor}
            inActiveStrokeColor='#EEEEEE'
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={15}
            activeStrokeWidth={15}
            title={resultText}
            titleColor={resultColor}
            titleStyle={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
          />
        </View>
        
        {/* Result summary card with gradient background */}
        <View style={styles.resultSummaryCard}>
          <LinearGradient
            colors={gradientColors}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={[styles.resultIndicator, { backgroundColor: resultColor }]} />
          <Text style={styles.resultDescription}>{resultDescription}</Text>
        </View>
        
        {/* Child info section with improved styling */}
        <Text style={styles.sectionTitle}>Child Information</Text>
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
        
        {/* AI Analysis section with improved styling */}
        {analysisText && (
          <>
            <Text style={styles.sectionTitle}>AI Analysis</Text>
            <View style={styles.aiAnalysisContainer}>
              <View style={[styles.aiIndicator, { backgroundColor: resultColor }]} />
              <Text style={styles.aiAnalysisText}>{analysisText}</Text>
            </View>
          </>
        )}
        
        {/* Recommendations section with improved styling */}
        {recommendations && recommendations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recommendations</Text>
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
        
        {/* Action buttons with improved styling */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Save Results"
            onPress={() => navigation.navigate('Home')}
            style={[styles.saveButton, { backgroundColor: resultColor }]}
          />
          
          <TouchableOpacity 
            style={[styles.recalculateButton, { borderColor: resultColor }]}
            onPress={() => {
              setShowResults(false);
              setRiskLevel(null);
            }}
          >
            <Text style={[styles.recalculateText, { color: resultColor }]}>Re-calculate</Text>
          </TouchableOpacity>
        </View>
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
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#20C997" />
            <Text style={styles.loadingText}>Analyzing with AI...</Text>
          </View>
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
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 28,
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 16,
  },
  resultsContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsTitle: {
    fontSize: 26,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  resultSummaryCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  resultDescription: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Medium',
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333333',
    marginVertical: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    alignSelf: 'flex-start',
    width: '100%',
  },
  childInfoContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginVertical: 8,
  },
  childInfoLabel: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  childInfoValue: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  aiAnalysisContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  aiIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  aiAnalysisText: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
    paddingLeft: 10,
  },
  recommendationsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  actionButtonsContainer: {
    width: '100%',
    marginTop: 8,
  },
  saveButton: {
    marginBottom: 16,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
  },
  recalculateButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#20C997',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  recalculateText: {
    color: '#20C997',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    width: width * 0.8,
    maxWidth: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});

export default StuntingCalculatorScreen;