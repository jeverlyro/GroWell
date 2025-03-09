import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Start with empty growth data
const initialGrowthData = [];

// Create a memoized input component to prevent unnecessary re-renders
const MemoizedInput = memo(({ label, value, onChangeText, placeholder, keyboardType }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      maxLength={6} // Limit input length for better performance
    />
  </View>
));

const GrowthTrackerScreen = ({ navigation }) => {
  const [growthData, setGrowthData] = useState(initialGrowthData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHeight, setNewHeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newAge, setNewAge] = useState('');

  // Data for charts
  const heightData = {
    labels: growthData.length > 0 ? growthData.map(item => `${item.age}m`) : ['0'],
    datasets: [
      {
        data: growthData.length > 0 ? growthData.map(item => item.height) : [0],
        color: (opacity = 1) => `rgba(32, 201, 151, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Height (cm)"]
  };

  const weightData = {
    labels: growthData.length > 0 ? growthData.map(item => `${item.age}m`) : ['0'],
    datasets: [
      {
        data: growthData.length > 0 ? growthData.map(item => item.weight) : [0],
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Weight (kg)"]
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 1,
  };

  const addNewGrowthData = () => {
    if (!newHeight || !newWeight || !newAge) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    const height = parseFloat(newHeight);
    const weight = parseFloat(newWeight);
    const age = parseInt(newAge);

    if (isNaN(height) || isNaN(weight) || isNaN(age)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: Date.now().toString(),
      date: today,
      height,
      weight,
      age
    };

    setGrowthData([...growthData, newEntry]);
    setModalVisible(false);
    setNewHeight('');
    setNewWeight('');
    setNewAge('');
  };

  const renderLatestMeasurements = () => {
    if (growthData.length === 0) {
      return (
        <View style={styles.emptyDataContainer}>
          <MaterialIcons name="trending-up" size={40} color="#CCCCCC" />
          <Text style={styles.emptyDataText}>No growth data available</Text>
          <Text style={styles.emptyDataSubtext}>Add your child's measurements to start tracking</Text>
        </View>
      );
    }

    return (
      <View style={styles.latestData}>
        <View style={styles.dataItem}>
          <MaterialIcons name="straighten" size={24} color="#20C997" />
          <Text style={styles.dataValue}>{growthData[growthData.length - 1].height} cm</Text>
          <Text style={styles.dataLabel}>Height</Text>
        </View>
        <View style={styles.dataItem}>
          <MaterialIcons name="monitor-weight" size={24} color="#FF9800" />
          <Text style={styles.dataValue}>{growthData[growthData.length - 1].weight} kg</Text>
          <Text style={styles.dataLabel}>Weight</Text>
        </View>
        <View style={styles.dataItem}>
          <MaterialIcons name="cake" size={24} color="#5C6BC0" />
          <Text style={styles.dataValue}>{growthData[growthData.length - 1].age} mo</Text>
          <Text style={styles.dataLabel}>Age</Text>
        </View>
      </View>
    );
  };

  const renderCharts = () => {
    if (growthData.length === 0) {
      return null;
    }

    return (
      <>
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Height Progress</Text>
          <LineChart
            data={heightData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>
          <LineChart
            data={weightData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </>
    );
  };

  const renderHistorySection = () => {
    if (growthData.length === 0) {
      return (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Growth History</Text>
          <View style={styles.emptyHistoryContainer}>
            <MaterialIcons name="history" size={40} color="#CCCCCC" />
            <Text style={styles.emptyDataText}>No history records</Text>
            <Text style={styles.emptyDataSubtext}>Your growth tracking history will appear here</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Growth History</Text>
        {growthData.slice().reverse().map((entry) => (
          <View key={entry.id} style={styles.historyItem}>
            <Text style={styles.historyDate}>{entry.date}</Text>
            <View style={styles.historyValues}>
              <Text style={styles.historyText}>Height: {entry.height} cm</Text>
              <Text style={styles.historyText}>Weight: {entry.weight} kg</Text>
              <Text style={styles.historyText}>Age: {entry.age} months</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Use useCallback to prevent recreating these functions on every render
  const handleHeightChange = useCallback((text) => {
    setNewHeight(text);
  }, []);

  const handleWeightChange = useCallback((text) => {
    setNewWeight(text);
  }, []);

  const handleAgeChange = useCallback((text) => {
    setNewAge(text);
  }, []);

  // Create a memoized modal component
  const GrowthDataModal = useCallback(() => (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Growth Data</Text>
          
          <MemoizedInput
            label="Height (cm)"
            value={newHeight}
            onChangeText={handleHeightChange}
            placeholder="Enter height in cm"
            keyboardType="numeric"
          />
          
          <MemoizedInput
            label="Weight (kg)"
            value={newWeight}
            onChangeText={handleWeightChange}
            placeholder="Enter weight in kg"
            keyboardType="numeric" 
          />
          
          <MemoizedInput
            label="Age (months)"
            value={newAge}
            onChangeText={handleAgeChange}
            placeholder="Enter age in months"
            keyboardType="numeric"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={addNewGrowthData}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ), [modalVisible, newHeight, newWeight, newAge, handleHeightChange, handleWeightChange, handleAgeChange]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={19} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Growth Tracker</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Latest Measurements</Text>
          {renderLatestMeasurements()}
        </View>

        {renderCharts()}
        {renderHistorySection()}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <GrowthDataModal />
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#202020',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  latestData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dataItem: {
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginTop: 8,
  },
  dataLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  emptyDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  emptyDataText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#666666',
    marginTop: 10,
  },
  emptyDataSubtext: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#999999',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  chartSection: {
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historySection: {
    marginBottom: 20,
  },
  historyItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#20C997',
    marginBottom: 5,
  },
  historyValues: {
    paddingLeft: 10,
  },
  historyText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#555555',
    marginBottom: 3,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#20C997',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#555555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#20C997',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#555555',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
  },
});

export default GrowthTrackerScreen;