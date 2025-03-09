import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddChildScreen = ({ navigation }) => {
  // Form state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState(null);
  
  // Date picker states for custom modal
  const [tempDate, setTempDate] = useState(new Date());
  const [tempDay, setTempDay] = useState(new Date().getDate().toString());
  const [tempMonth, setTempMonth] = useState((new Date().getMonth() + 1).toString());
  const [tempYear, setTempYear] = useState(new Date().getFullYear().toString());
  
  // Upload photo
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library');
        return;
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Confirm date selection
  const confirmDate = () => {
    try {
      // Validate inputs
      const day = parseInt(tempDay);
      const month = parseInt(tempMonth) - 1; // JS months are 0-indexed
      const year = parseInt(tempYear);
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        Alert.alert('Invalid Date', 'Please enter valid date values');
        return;
      }
      
      const newDate = new Date(year, month, day);
      
      // Check if date is valid and not in the future
      const today = new Date();
      if (newDate > today) {
        Alert.alert('Invalid Date', 'Birth date cannot be in the future');
        return;
      }
      
      // Check if date is reasonable (not before 1900)
      if (year < 1900) {
        Alert.alert('Invalid Date', 'Birth year must be after 1900');
        return;
      }
      
      setBirthDate(newDate);
      setShowDateModal(false);
    } catch (error) {
      Alert.alert('Invalid Date', 'Please enter a valid date');
    }
  };

  // Calculate age
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    
    return years;
  };

  // Handle save
  const handleSave = () => {
    // Validate form fields
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your child\'s name');
      return;
    }
    
    if (!gender) {
      Alert.alert('Missing Information', 'Please select your child\'s gender');
      return;
    }
    
    if (!height.trim() || isNaN(parseFloat(height))) {
      Alert.alert('Invalid Information', 'Please enter a valid height in cm');
      return;
    }
    
    if (!weight.trim() || isNaN(parseFloat(weight))) {
      Alert.alert('Invalid Information', 'Please enter a valid weight in kg');
      return;
    }

    // In a real app, you would save this data to your backend/database
    Alert.alert(
      'Success',
      'Child profile added successfully',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={19} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Child</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.childPhoto} />
            ) : (
              <>
                <MaterialIcons name="add-a-photo" size={32} color="#20C997" />
                <Text style={styles.photoText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Child's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter child's name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setTempDay(birthDate.getDate().toString());
              setTempMonth((birthDate.getMonth() + 1).toString());
              setTempYear(birthDate.getFullYear().toString());
              setShowDateModal(true);
            }}
          >
            <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
            <MaterialIcons name="calendar-today" size={20} color="#666666" />
          </TouchableOpacity>

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'male' && styles.selectedGender,
              ]}
              onPress={() => setGender('male')}
            >
              <MaterialIcons
                name="male"
                size={24}
                color={gender === 'male' ? '#FFFFFF' : '#666666'}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'male' && styles.selectedGenderText,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'female' && styles.selectedGender,
              ]}
              onPress={() => setGender('female')}
            >
              <MaterialIcons
                name="female"
                size={24}
                color={gender === 'female' ? '#FFFFFF' : '#666666'}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'female' && styles.selectedGenderText,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Physical Measurements</Text>

          <View style={styles.measurementsContainer}>
            <View style={styles.measurement}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.measureInput}
                placeholder="0.0"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.measurement}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.measureInput}
                placeholder="0.0"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.agePreview}>
            <Text style={styles.agePreviewLabel}>Age:</Text>
            <Text style={styles.agePreviewValue}>
              {calculateAge(birthDate)} years old
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Child Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Date Picker Modal */}
      <Modal
        transparent={true}
        visible={showDateModal}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>Select Birth Date</Text>
            
            <View style={styles.dateInputsRow}>
              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateInputLabel}>Day</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={tempDay}
                  onChangeText={setTempDay}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="DD"
                />
              </View>
              
              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateInputLabel}>Month</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={tempMonth}
                  onChangeText={setTempMonth}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                />
              </View>
              
              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateInputLabel}>Year</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={tempYear}
                  onChangeText={setTempYear}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="YYYY"
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmDate}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#202020',
  },
  scrollView: {
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  childPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    marginTop: 8,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedGender: {
    backgroundColor: '#20C997',
    borderColor: '#20C997',
  },
  genderText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
    marginLeft: 10,
  },
  selectedGenderText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 16,
    marginTop: 10,
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurement: {
    width: '48%',
  },
  measureInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  agePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  agePreviewLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
  },
  agePreviewValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#20C997',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  datePickerTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#20C997',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputWrapper: {
    width: '30%',
  },
  dateInputLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
    marginBottom: 5,
  },
  datePickerInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#20C997',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#FFFFFF',
  },
});

export default AddChildScreen;