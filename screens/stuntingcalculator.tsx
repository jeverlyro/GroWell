import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/button';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useFonts } from 'expo-font';
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
      maxLength={6}
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
  const [growthInsights, setGrowthInsights] = useState([]);

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
      
      // Local calculation instead of API call
      // Calculate expected height based on WHO growth standards (simplified)
      const expectedHeight = gender === 'Male' 
        ? 45 + (ageInMonths * 0.7) // Simplified male growth estimate
        : 44 + (ageInMonths * 0.7); // Simplified female growth estimate
      
      // Calculate height-for-age Z-score (simplified)
      const heightForAgeZ = (heightInCm - expectedHeight) / 5;
      
      // Calculate weight-for-age (simplified)
      const expectedWeight = gender === 'Male'
        ? 3.5 + (ageInMonths * 0.2) // Simplified male weight estimate
        : 3.3 + (ageInMonths * 0.2); // Simplified female weight estimate
      
      const weightForAgeZ = (weightInKg - expectedWeight) / 1;
      
      // Determine risk level
      let riskLevel, riskPercentage, stuntingStatus, analysisText;
      
      if (heightForAgeZ < -3) {
        riskLevel = 'high';
        riskPercentage = 85;
        stuntingStatus = 'Severe stunting';
        analysisText = `${childName} shows signs of severe stunting with a height significantly below the expected range for ${gender === 'Male' ? 'his' : 'her'} age. Immediate medical consultation is recommended.`;
      } else if (heightForAgeZ < -2) {
        riskLevel = 'medium';
        riskPercentage = 60;
        stuntingStatus = 'Moderate stunting';
        analysisText = `${childName} shows signs of moderate stunting with height below the expected range for ${gender === 'Male' ? 'his' : 'her'} age. Regular monitoring and nutritional improvements are recommended.`;
      } else {
        riskLevel = 'low';
        riskPercentage = 15;
        stuntingStatus = 'Normal growth';
        analysisText = `${childName}'s height is within the normal range for ${gender === 'Male' ? 'his' : 'her'} age according to simplified WHO standards.`;
      }
      
      // Generate recommendations based on risk level
      const recommendations = [];
      if (riskLevel === 'high') {
        recommendations.push(
          'Consult with a pediatrician or nutritionist as soon as possible.',
          'Ensure a diverse diet rich in protein, vitamins, and minerals.',
          'Monitor growth regularly, ideally every month.',
          'Consider supplementation as recommended by healthcare provider.'
        );
      } else if (riskLevel === 'medium') {
        recommendations.push(
          'Increase dietary diversity with more protein-rich foods.',
          'Ensure adequate intake of vitamins A, D, and minerals like iron, zinc, and calcium.',
          'Monitor growth monthly to track progress.',
          'Practice good hygiene and sanitation to prevent infections.'
        );
      } else {
        recommendations.push(
          'Continue with a balanced diet appropriate for your child\'s age.',
          'Maintain regular checkups with your healthcare provider.',
          'Ensure adequate physical activity for age-appropriate development.',
          'Continue good hygiene practices.'
        );
      }
      
      // Create simple growth metrics
      const growthMetrics = {
        expected_height: expectedHeight.toFixed(1),
        height_for_age_z: heightForAgeZ.toFixed(2),
        expected_weight: expectedWeight.toFixed(1),
        weight_for_age_z: weightForAgeZ.toFixed(2)
      };
      
      // Generate simple growth insights
      const growthInsights = [
        `Current height is ${Math.abs(heightForAgeZ).toFixed(1)} standard deviations ${heightForAgeZ < 0 ? 'below' : 'above'} the average for age and gender.`,
        `Current weight is ${Math.abs(weightForAgeZ).toFixed(1)} standard deviations ${weightForAgeZ < 0 ? 'below' : 'above'} the average for age and gender.`,
        `Expected height range for ${ageInMonths} month old ${gender.toLowerCase()} is approximately ${(expectedHeight - 7).toFixed(1)} to ${(expectedHeight + 7).toFixed(1)} cm.`
      ];
      
      // Simple mock data for growth chart
      const growthChartData = {
        labels: ['Birth', '3m', '6m', '9m', '12m', '18m', '24m'],
        datasets: {
          median: [50, 61, 67, 72, 76, 82, 87],
          patientData: Array(7).fill(0).map((_, i) => {
            // Only fill in data points up to current age
            if (i * 3 <= ageInMonths) {
              const modifier = heightForAgeZ * 3;
              return 50 + (i * 6) + modifier;
            }
            return null;
          }).filter(val => val !== null)
        }
      };
      
      // Set all the state variables with locally calculated data
      setRiskLevel(riskLevel);
      setRiskPercentage(riskPercentage);
      setAnalysisText(analysisText);
      setRecommendations(recommendations);
      setStuntingStatus(stuntingStatus);
      setGrowthMetrics(growthMetrics);
      setGrowthInsights(growthInsights);
      
      setShowResults(true);
    } catch (error) {
      console.error('Failed to calculate stunting risk:', error);
      Alert.alert(
        'Calculation Error',
        'Unable to complete the calculation. Please check your input and try again.',
        [{ text: 'OK' }]
      );
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
          {/* Child's basic information */}
          <View style={styles.infoCard}>
            <Text style={styles.infoSectionTitle}>Basic Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{childName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{age} months</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{gender}</Text>
              </View>
            </View>
          </View>
          
          {/* Measurements */}
          <View style={styles.infoCard}>
            <Text style={styles.infoSectionTitle}>Measurements</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{height} cm</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{weight} kg</Text>
              </View>
            </View>
            
            {growthMetrics?.expected_height && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Expected Height</Text>
                  <Text style={styles.infoValue}>{growthMetrics.expected_height} cm</Text>
                </View>
                {growthMetrics?.expected_weight && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Expected Weight</Text>
                    <Text style={styles.infoValue}>{growthMetrics.expected_weight} kg</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          {/* Z-Scores (if available) */}
          {(growthMetrics?.height_for_age_z || growthMetrics?.weight_for_age_z) && (
            <View style={styles.infoCard}>
              <Text style={styles.infoSectionTitle}>Growth Metrics</Text>
              
              <View style={styles.infoRow}>
                {growthMetrics?.height_for_age_z && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Height-for-Age Z</Text>
                    <Text style={styles.infoValue}>{growthMetrics.height_for_age_z}</Text>
                  </View>
                )}
                {growthMetrics?.weight_for_age_z && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Weight-for-Age Z</Text>
                    <Text style={styles.infoValue}>{growthMetrics.weight_for_age_z}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
        
        {/* Growth insights section */}
        {growthInsights && growthInsights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Growth Insights</Text>
            <View style={styles.insightsContainer}>
              {growthInsights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: resultColor }]} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        
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
            <Text style={styles.formTitle}>Growth Assessment</Text>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionHeader}>Personal Details</Text>
              
              <Text style={styles.label}>Child's Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={childName}
                  onChangeText={setChildName}
                  placeholder="Enter child's name"
                  placeholderTextColor="#BDBDBD"
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Age (months)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={age}
                      onChangeText={handleAgeChange}
                      placeholder="Enter age"
                      placeholderTextColor="#BDBDBD"
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                </View>
                
                <View style={styles.formColumn}>
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
                </View>
              </View>
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionHeader}>Measurements</Text>
              
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <View style={styles.inputWrapper}>
                    <NumericInput
                      style={styles.input}
                      value={height}
                      onChangeText={setHeight}
                      placeholder="Height"
                    />
                    <Text style={styles.unitText}>cm</Text>
                  </View>
                </View>
                
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <View style={styles.inputWrapper}>
                    <NumericInput
                      style={styles.input}
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="Weight"
                    />
                    <Text style={styles.unitText}>kg</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.noteContainer}>
              <Text style={styles.noteIcon}>ℹ️</Text>
              <Text style={styles.noteText}>
                Height and weight measurements should be recent for accurate results.
              </Text>
            </View>
            
            <Button
              title={isFormValid ? "Calculate Risk" : "Please Fill All Fields"}
              onPress={calculateRisk}
              disabled={!isFormValid}
              style={[
                styles.calculateButton,
                !isFormValid && styles.disabledButton
              ]}
            />
            
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => Alert.alert(
                "How to measure correctly",
                "For height: Measure your child standing straight against a wall.\n\nFor weight: Use a digital scale on a flat surface for best accuracy."
              )}
            >
              <Text style={styles.helpButtonText}>Need help with measurements?</Text>
            </TouchableOpacity>
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
    fontSize: 14,
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
  insightsContainer: {
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
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightText: {
    fontSize: 16,
    color: '#555555',
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 24,
  },
  chartContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoSectionTitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888888',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  formColumn: {
    flex: 1,
    marginRight: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unitText: {
    fontSize: 16,
    color: '#555555',
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  noteIcon: {
    fontSize: 24,
    color: '#FFC107',
    marginRight: 12,
  },
  noteText: {
    fontSize: 16,
    color: '#555555',
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },
  helpButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    color: '#20C997',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
});

export default StuntingCalculatorScreen;