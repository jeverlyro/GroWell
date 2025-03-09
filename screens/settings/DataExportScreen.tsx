import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DataExportScreen = ({ navigation }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    // Simulate data export process
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      Alert.alert(
        "Export Complete",
        "Your data has been successfully exported. A download link has been sent to your registered email address.",
        [{ text: "OK" }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Your Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Ionicons name="download-outline" size={60} color="#20C997" style={styles.icon} />
          
          <Text style={styles.title}>Request Your Data</Text>
          
          <Text style={styles.description}>
            You can download a copy of all your personal data stored in our system. 
            This includes your profile information, preferences, activity history, and any content you've created.
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What's included in your data:</Text>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Profile information and settings</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Child growth history and records</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Activity logs and milestones</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Photos and media you've uploaded</Text>
            </View>
          </View>

          <Text style={styles.noteText}>
            The export process may take a few minutes to complete. Once ready, a download 
            link will be sent to your registered email address. This link will be valid for 7 days.
          </Text>

          <TouchableOpacity 
            style={[styles.button, isExporting && styles.buttonDisabled]}
            onPress={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {exportComplete ? "Export Again" : "Request Data Export"}
              </Text>
            )}
          </TouchableOpacity>

          {exportComplete && (
            <Text style={styles.successText}>
              Export request submitted. Check your email for the download link.
            </Text>
          )}

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <TouchableOpacity>
              <Text style={styles.helpLink}>Contact our support team</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#20C997',
    marginRight: 10,
  },
  bulletText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#333333',
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#20C997',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A8E5D6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  successText: {
    color: '#20C997',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    marginTop: 15,
    textAlign: 'center',
  },
  helpSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 5,
  },
  helpLink: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#20C997',
    textDecorationLine: 'underline',
  },
});

export default DataExportScreen;