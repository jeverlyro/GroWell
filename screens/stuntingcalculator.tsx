import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/button';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

// Define a consistent color palette
const COLORS = {
  primary: '#20C997',
  primaryLight: '#E6F8F3',
  secondary: '#6C757D',
  dark: '#343A40',
  light: '#F8F9FA',
  lightGray: '#E9ECEF',
  mediumGray: '#ADB5BD',
  danger: '#DC3545',
  warning: '#FFC107',
  white: '#FFFFFF',
  black: '#000000',
};

const NumericInput = React.memo(({ value, onChangeText, placeholder, style, icon, unit }) => {
  const handleChangeText = useCallback((text) => {
    // Only allow numeric input with decimal point
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (text === '' || numericRegex.test(text)) {
      onChangeText(text);
    }
  }, [onChangeText]);

  return (
    <View style={styles.inputWrapper}>
      {icon && <Ionicons name={icon} size={20} color={COLORS.secondary} style={styles.inputIcon} />}
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mediumGray}
        keyboardType="numeric"
        maxLength={6}
      />
      {unit && <Text style={styles.unitText}>{unit}</Text>}
    </View>
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
        
        {/* Improved risk indicator with animation */}
        <View style={styles.riskSummarySection}>
          <View style={styles.circularProgressContainer}>
            <CircularProgress 
              value={riskPercentage} 
              radius={80} 
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
              titleStyle={{ fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 14, marginBottom: 8 }}
              progressValueStyle={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 36 }}
            />
          </View>
          
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, {color: resultColor}]}>{stuntingStatus}</Text>
            <Text style={styles.statusDescription}>{childName}'s growth assessment</Text>
          </View>
        </View>
        
        {/* Enhanced result summary card with gradient background */}
        <View style={styles.resultSummaryCard}>
          <LinearGradient
            colors={gradientColors}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.resultCardContent}>
            <View style={[styles.resultIndicator, { backgroundColor: resultColor }]} />
            <Text style={styles.resultDescription}>{resultDescription}</Text>
            <Ionicons 
              name={riskLevel === 'high' ? 'alert-circle' : riskLevel === 'medium' ? 'warning' : 'checkmark-circle'} 
              size={20} 
              color={resultColor} 
              style={styles.resultIcon} 
            />
          </View>
        </View>
        
        {/* Growth journey timeline */}
        <Text style={styles.sectionTitle}>Growth Journey</Text>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />
          
          {/* Past point */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelinePoint, {backgroundColor: COLORS.mediumGray}]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>Today</Text>
              <View style={styles.timelineCard}>
                <Text style={styles.timelineTitle}>Current Assessment</Text>
                <Text style={styles.timelineValue}>{stuntingStatus}</Text>
              </View>
            </View>
          </View>
          
          {/* Current point */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelinePoint, {backgroundColor: resultColor}]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>Next Steps</Text>
              <View style={styles.timelineCard}>
                <Text style={styles.timelineTitle}>Recommended Follow-up</Text>
                <Text style={styles.timelineValue}>
                  {riskLevel === 'high' ? 'Within 2 weeks' : 
                   riskLevel === 'medium' ? 'Within 1 month' : 
                   'Within 3 months'}
                </Text>
              </View>
            </View>
          </View>
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
          
          {/* Measurements with visual indicators */}
          <View style={styles.infoCard}>
            <Text style={styles.infoSectionTitle}>Measurements</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.measurementHeader}>
                  <Text style={styles.infoLabel}>Height</Text>
                  <Ionicons name="resize-outline" size={16} color={COLORS.secondary} />
                </View>
                <Text style={styles.infoValue}>{height} cm</Text>
                {growthMetrics?.expected_height && (
                  <View style={styles.comparisonContainer}>
                    <Text style={styles.comparisonLabel}>vs. expected:</Text>
                    <Text style={[
                      styles.comparisonValue, 
                      {color: parseFloat(height) < parseFloat(growthMetrics.expected_height) ? COLORS.danger : COLORS.primary}
                    ]}>
                      {parseFloat(height) < parseFloat(growthMetrics.expected_height) ? '-' : '+'}{Math.abs(parseFloat(height) - parseFloat(growthMetrics.expected_height)).toFixed(1)} cm
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.infoItem}>
                <View style={styles.measurementHeader}>
                  <Text style={styles.infoLabel}>Weight</Text>
                  <Ionicons name="scale-outline" size={16} color={COLORS.secondary} />
                </View>
                <Text style={styles.infoValue}>{weight} kg</Text>
                {growthMetrics?.expected_weight && (
                  <View style={styles.comparisonContainer}>
                    <Text style={styles.comparisonLabel}>vs. expected:</Text>
                    <Text style={[
                      styles.comparisonValue, 
                      {color: parseFloat(weight) < parseFloat(growthMetrics.expected_weight) ? COLORS.danger : COLORS.primary}
                    ]}>
                      {parseFloat(weight) < parseFloat(growthMetrics.expected_weight) ? '-' : '+'}{Math.abs(parseFloat(weight) - parseFloat(growthMetrics.expected_weight)).toFixed(1)} kg
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {/* Z-Scores with visual gauge */}
          {(growthMetrics?.height_for_age_z || growthMetrics?.weight_for_age_z) && (
            <View style={styles.infoCard}>
              <Text style={styles.infoSectionTitle}>Growth Metrics</Text>
              
              {growthMetrics?.height_for_age_z && (
                <View style={styles.zScoreContainer}>
                  <Text style={styles.zScoreLabel}>Height-for-Age Z-score</Text>
                  <View style={styles.zScoreGauge}>
                    <View style={styles.zScoreBar}>
                      <View style={[styles.zScoreIndicator, {
                        left: `${Math.min(Math.max((parseFloat(growthMetrics.height_for_age_z) + 3) / 6 * 100, 0), 100)}%`,
                        backgroundColor: parseFloat(growthMetrics.height_for_age_z) < -2 ? COLORS.danger : 
                                        parseFloat(growthMetrics.height_for_age_z) < -1 ? COLORS.warning : COLORS.primary
                      }]} />
                    </View>
                    <View style={styles.zScoreTicks}>
                      <Text style={styles.zScoreTick}>-3</Text>
                      <Text style={styles.zScoreTick}>-2</Text>
                      <Text style={styles.zScoreTick}>-1</Text>
                      <Text style={styles.zScoreTick}>0</Text>
                      <Text style={styles.zScoreTick}>+1</Text>
                      <Text style={styles.zScoreTick}>+2</Text>
                      <Text style={styles.zScoreTick}>+3</Text>
                    </View>
                  </View>
                  <Text style={styles.zScoreValue}>{growthMetrics.height_for_age_z}</Text>
                  <Text style={styles.zScoreExplanation}>
                    {parseFloat(growthMetrics.height_for_age_z) < -3 ? 
                      'Severe stunting (< -3SD)' : 
                      parseFloat(growthMetrics.height_for_age_z) < -2 ? 
                      'Moderate stunting (< -2SD)' : 
                      parseFloat(growthMetrics.height_for_age_z) < -1 ? 
                      'Risk of stunting (< -1SD)' : 
                      'Normal growth (≥ -1SD)'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Growth insights section with enhanced styling */}
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
              <View style={styles.aiHeaderRow}>
                <Ionicons name="analytics-outline" size={20} color={resultColor} />
                <Text style={[styles.aiAnalysisTitle, {color: resultColor}]}>Assessment Summary</Text>
              </View>
              <Text style={styles.aiAnalysisText}>{analysisText}</Text>
            </View>
          </>
        )}

        {/* Enhanced recommendations section with icons */}
        {recommendations && recommendations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <View style={styles.recommendationsCard}>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={styles.enhancedRecommendationItem}>
                  <View style={[styles.recommendationIconContainer, {backgroundColor: `${resultColor}20`}]}>
                    <Ionicons 
                      name={
                        index === 0 ? "medkit-outline" : 
                        index === 1 ? "nutrition-outline" : 
                        index === 2 ? "calendar-outline" : "shield-checkmark-outline"
                      } 
                      size={16} 
                      color={resultColor}
                    />
                  </View>
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
            onPress={() => navigation.navigate("MainApp", { screen: "HomeTab" })}
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
        
        {/* Share results option */}
        <TouchableOpacity 
          style={styles.shareResultsButton}
          onPress={() => Alert.alert("Share Results", "This feature will allow sharing results with healthcare providers.")}
        >
          <Ionicons name="share-outline" size={20} color={COLORS.secondary} />
          <Text style={styles.shareResultsText}>Share results with healthcare provider</Text>
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
          <Ionicons name="arrow-back" size={19} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Growth Assessment</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {!showResults ? (
          <View style={styles.formContainer}>
            <View style={styles.formIntro}>
              <Text style={styles.formTitle}>Stunting Risk Calculator</Text>
              <Text style={styles.formSubtitle}>Enter your child's details for assessment</Text>
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionHeader}>Personal Details</Text>
              
              <Text style={styles.label}>Child's Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={childName}
                  onChangeText={setChildName}
                  placeholder="Enter child's name"
                  placeholderTextColor={COLORS.mediumGray}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Age (months)</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={age}
                      onChangeText={handleAgeChange}
                      placeholder="Age"
                      placeholderTextColor={COLORS.mediumGray}
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
                  <Text style={styles.label}>Height</Text>
                  <NumericInput
                    value={height}
                    onChangeText={setHeight}
                    placeholder="Height"
                    icon="resize-outline"
                    unit="cm"
                  />
                </View>
                
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Weight</Text>
                  <NumericInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Weight"
                    icon="scale-outline"
                    unit="kg"
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.warning} style={styles.noteIcon} />
              <Text style={styles.noteText}>
                Recent height and weight measurements will provide the most accurate results.
              </Text>
            </View>
            
            <Button
              title={isFormValid ? "Calculate Risk" : "Complete All Fields"}
              onPress={calculateRisk}
              disabled={!isFormValid}
              style={[
                styles.calculateButton,
                !isFormValid && styles.disabledButton,
                isFormValid && styles.activeButton
              ]}
            />
                        
            <TouchableOpacity 
              style={styles.helpLink}
              onPress={() => Alert.alert(
                "How to measure correctly",
                "For height: Measure your child standing straight against a wall.\n\nFor weight: Use a digital scale on a flat surface for best accuracy."
              )}
            >
              <Text style={styles.helpLinkText}>Need help with measurements?</Text>
            </TouchableOpacity>
          </View>
        ) : renderResults()}
      </ScrollView>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Analyzing data...</Text>
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
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  placeholder: {
    width: 30,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  formContainer: {
    padding: 24,
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formIntro: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  formSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 18,
    color: COLORS.dark,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  label: {
    fontSize: 16,
    color: COLORS.secondary,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: COLORS.dark,
  },
  unitText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: 'PlusJakartaSans-Medium',
    marginLeft: 8,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formColumn: {
    flex: 1,
    marginRight: 12,
  },
  formColumnLast: {
    flex: 1,
    marginRight: 0,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  selectedGender: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  selectedGenderText: {
    color: COLORS.white,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
    lineHeight: 20,
  },
  calculateButton: {
    borderRadius: 8,
    paddingVertical: 16,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  helpLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  helpLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: 'PlusJakartaSans-Medium',
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
  loadingCard: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.black,
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
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  resultsContainer: {
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16, // Slightly larger radius
    margin: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, // Slightly stronger shadow
    shadowRadius: 4,
    elevation: 3, // Slightly higher elevation
  },
  resultsTitle: {
    fontSize: 26, 
    color: COLORS.dark,
    marginBottom: 28, 
    fontFamily: 'PlusJakartaSans-SemiBold',
    alignSelf: 'center',
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  resultSummaryCard: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32, // More spacing below card
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  resultCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  resultDescription: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  resultIcon: {
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20, // Larger section titles
    color: COLORS.dark,
    marginVertical: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  childInfoContainer: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: COLORS.white, // Changed from light to white
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  infoSectionTitle: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  insightsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 0, // Adjusted spacing
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  insightText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },
  aiAnalysisContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 0, // Adjusted spacing
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginLeft: 8,
  },
  aiAnalysisText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  recommendationsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 32, // More space below recommendations
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  enhancedRecommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed to align to top
    marginBottom: 18,
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
    lineHeight: 25,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recalculateButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recalculateText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  shareResultsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  shareResultsText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: 'PlusJakartaSans-Medium',
    marginLeft: 8,
  },
  riskSummarySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32, // More spacing below section
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  circularProgressWrapper: {
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    marginLeft: 15,
    marginBottom: 4,
    lineHeight: 28,
  },
  statusDescription: {
    fontSize: 15,
    color: COLORS.secondary,
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 8,
    marginLeft: 15,
  },
  riskIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  riskLevelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  riskLevelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  timelineContainer: {
    position: 'relative',
    marginBottom: 0, // Adjusted to remove extra space
    paddingVertical: 8, // Added internal padding
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  timelineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: COLORS.dark,
  },
  infoValueLarge: {
    fontSize: 20,
    color: COLORS.dark,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  comparisonValue: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  zScoreHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zScoreValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  // Add these missing styles to your StyleSheet:

zScoreContainer: {
  marginVertical: 10,
},
zScoreLabel: {
  fontSize: 14,
  color: COLORS.secondary,
  fontFamily: 'PlusJakartaSans-Medium',
  marginBottom: 8,
},
zScoreGauge: {
  marginVertical: 6,
},
zScoreBar: {
  height: 8,
  backgroundColor: COLORS.lightGray,
  borderRadius: 4,
  marginBottom: 4,
  position: 'relative',
},
zScoreIndicator: {
  width: 12,
  height: 12,
  borderRadius: 6,
  position: 'absolute',
  top: -2,
  marginLeft: -6,
  borderWidth: 2,
  borderColor: COLORS.white,
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  elevation: 2,
},
zScoreTicks: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 4,
},
zScoreTick: {
  fontSize: 10,
  color: COLORS.secondary,
  fontFamily: 'PlusJakartaSans-Medium',
},
zScoreValue: {
  fontSize: 18,
  fontFamily: 'PlusJakartaSans-Bold',
  color: COLORS.dark,
  marginTop: 8,
},
zScoreExplanation: {
  fontSize: 13,
  color: COLORS.secondary,
  fontFamily: 'PlusJakartaSans-Regular',
  marginTop: 4,
},
measurementHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},
comparisonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},
comparisonLabel: {
  fontSize: 12,
  color: COLORS.secondary,
  fontFamily: 'PlusJakartaSans-Regular',
  marginRight: 4,
},
timelineLine: {
  position: 'absolute',
  left: 27,
  top: 24,
  bottom: 24,
  width: 1,
  backgroundColor: COLORS.lightGray,
},
timelineItem: {
  flexDirection: 'row',
  marginBottom: 16,
},
timelinePoint: {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginRight: 16,
  zIndex: 1,
  borderWidth: 2,
  borderColor: COLORS.white,
},
timelineContent: {
  flex: 1,
},
timelineDate: {
  fontSize: 13,
  color: COLORS.secondary,
  fontFamily: 'PlusJakartaSans-Medium',
  marginBottom: 8,
},
});

export default StuntingCalculatorScreen;