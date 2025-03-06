import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
// Remove the problematic import
// import DateTimePicker from '@react-native-community/datetimepicker';

const FREQUENCY_OPTIONS = ['Once', 'Daily', 'Weekly'];

const AddReminderScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Date and Time
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Frequency
  const [frequency, setFrequency] = useState('Once');
  const [selectedDay, setSelectedDay] = useState('');
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Create simple time picker
  const createTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeDate = new Date();
        timeDate.setHours(hour, minute, 0);
        options.push({
          label: formatTime(timeDate),
          value: timeDate
        });
      }
    }
    return options;
  };

  // Create simple date options for next 30 days
  const createDateOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      options.push({
        label: formatDate(date),
        value: date
      });
    }
    return options;
  };
  
  // Time picker options
  const timeOptions = createTimeOptions();
  // Date picker options
  const dateOptions = createDateOptions();

  // Handle time selection
  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  };

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };
  
  // Weekly day selection
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Handle day selection
  const handleDayPress = (day) => {
    setSelectedDay(day);
  };
  
  // Format day string based on frequency
  const formatDayString = () => {
    if (frequency === 'Once') {
      return formatDate(date);
    } else if (frequency === 'Daily') {
      return 'Daily';
    } else if (frequency === 'Weekly') {
      return `Every ${selectedDay}`;
    }
    return '';
  };
  
  // Save reminder
  const saveReminder = () => {
    if (!title.trim()) {
      alert('Please enter a reminder title');
      return;
    }
    
    if (frequency === 'Weekly' && !selectedDay) {
      alert('Please select a day for weekly reminder');
      return;
    }
    
    const newReminder = {
      title,
      description,
      time: formatTime(time),
      day: formatDayString(),
    };
    
    navigation.navigate('Reminders', { newReminder });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Reminder</Text>
            <TouchableOpacity onPress={saveReminder}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput 
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter reminder title"
                placeholderTextColor="#AAAAAA"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput 
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description (optional)"
                placeholderTextColor="#AAAAAA"
                multiline={true}
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.frequencyOptions}>
                {FREQUENCY_OPTIONS.map((option) => (
                  <TouchableOpacity 
                    key={option} 
                    style={[
                      styles.frequencyOption,
                      frequency === option && styles.activeFrequencyOption
                    ]}
                    onPress={() => setFrequency(option)}
                  >
                    <Text 
                      style={[
                        styles.frequencyText,
                        frequency === option && styles.activeFrequencyText
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {frequency === 'Weekly' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Day of Week</Text>
                <View style={styles.daysContainer}>
                  {weekDays.map((day) => (
                    <TouchableOpacity 
                      key={day} 
                      style={[
                        styles.dayButton,
                        selectedDay === day && styles.activeDayButton
                      ]}
                      onPress={() => handleDayPress(day)}
                    >
                      <Text 
                        style={[
                          styles.dayText,
                          selectedDay === day && styles.activeDayText
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {frequency === 'Once' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons name="calendar-today" size={20} color="#666666" />
                  <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <MaterialIcons name="access-time" size={20} color="#666666" />
                <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          {/* Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Time</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <MaterialIcons name="close" size={24} color="#333333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={{ maxHeight: 300 }}>
                  {timeOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.optionItem}
                      onPress={() => handleTimeSelect(option.value)}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          
          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <MaterialIcons name="close" size={24} color="#333333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={{ maxHeight: 300 }}>
                  {dateOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.optionItem}
                      onPress={() => handleDateSelect(option.value)}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.saveReminderButton}
              onPress={saveReminder}
            >
              <Text style={styles.saveReminderText}>Save Reminder</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    color: '#333333',
  },
  saveButton: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#20C997',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeFrequencyOption: {
    backgroundColor: '#E3F8F1',
  },
  frequencyText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  activeFrequencyText: {
    color: '#20C997',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 4,
  },
  activeDayButton: {
    backgroundColor: '#20C997',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveReminderButton: {
    backgroundColor: '#20C997',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveReminderText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
  }
});

export default AddReminderScreen;