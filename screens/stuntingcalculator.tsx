import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/button';

const StuntingCalculatorScreen = ({ navigation }) => {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [riskLevel, setRiskLevel] = useState(null);

  const calculateRisk = () => {
    // This is a simplified version. In a real app, you would use
    // WHO growth standards or other medical algorithms
    const ageInMonths = parseInt(age);
    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    
    // Example calculation - this should be replaced with actual medical formulas
    if (gender === 'Male') {
      // Example threshold for boys (simplified)
      const expectedHeight = 45 + (ageInMonths * 0.5);
      const heightForAgeZ = (heightInCm - expectedHeight) / 5;
      
      if (heightForAgeZ < -3) {
        setRiskLevel('high');
      } else if (heightForAgeZ < -2) {
        setRiskLevel('medium');
      } else {
        setRiskLevel('low');
      }
    } else {
      // Example threshold for girls (simplified)
      const expectedHeight = 44 + (ageInMonths * 0.5);
      const heightForAgeZ = (heightInCm - expectedHeight) / 5;
      
      if (heightForAgeZ < -3) {
        setRiskLevel('high');
      } else if (heightForAgeZ < -2) {
        setRiskLevel('medium');
      } else {
        setRiskLevel('low');
      }
    }
    
    setShowResults(true);
  };

  const isFormValid = () => {
    return (
      childName.trim() !== '' &&
      age !== '' &&
      gender !== '' &&
      height !== '' &&
      weight !== ''
    );
  };

  const renderResults = () => {
    let resultColor = '#20C997'; // Green for low risk
    let resultText = 'Low Risk';
    let resultDescription = 'Your child appears to be growing well according to WHO standards.';
    
    if (riskLevel === 'medium') {
      resultColor = '#FFC107'; // Yellow/amber for medium risk
      resultText = 'Moderate Risk';
      resultDescription = 'Your child may be at risk for stunting. We recommend consultation with a healthcare provider.';
    } else if (riskLevel === 'high') {
      resultColor = '#FF5252'; // Red for high risk
      resultText = 'High Risk';
      resultDescription = 'Your child shows significant signs of stunting risk. Please consult with a healthcare provider as soon as possible.';
    }
    
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Results</Text>
        <View style={[styles.riskIndicator, { backgroundColor: resultColor }]}>
          <Text style={styles.riskText}>{resultText}</Text>
        </View>
        <Text style={styles.resultDescription}>{resultDescription}</Text>
        
        <Text style={styles.recommendationsTitle}>Recommendations:</Text>
        <View style={styles.recommendationItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.recommendationText}>Track your child's growth regularly</Text>
        </View>
        <View style={styles.recommendationItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.recommendationText}>Ensure a balanced diet rich in proteins and nutrients</Text>
        </View>
        <View style={styles.recommendationItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.recommendationText}>Consider consulting with a pediatrician</Text>
        </View>
        
        <Button
          title="Save Results"
          onPress={() => navigation.navigate('Home')}
          style={styles.saveButton}
        />
        <TouchableOpacity onPress={() => setShowResults(false)}>
          <Text style={styles.recalculateText}>Recalculate</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
            />
            
            <Text style={styles.label}>Age (months)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age in months"
              keyboardType="numeric"
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
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter height in centimeters"
              keyboardType="numeric"
            />
            
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight in kilograms"
              keyboardType="numeric"
            />
            
            <Button
              title="Calculate Risk"
              onPress={calculateRisk}
              disabled={!isFormValid()}
              style={styles.calculateButton}
            />
          </View>
        ) : renderResults()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 30,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  selectedGender: {
    backgroundColor: '#20C997',
    borderColor: '#20C997',
  },
  genderText: {
    color: '#333333',
    fontSize: 16,
  },
  selectedGenderText: {
    color: '#FFFFFF',
  },
  calculateButton: {
    marginTop: 10,
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  riskIndicator: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 24,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#20C997',
    marginRight: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 15,
  },
  recalculateText: {
    color: '#20C997',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StuntingCalculatorScreen;