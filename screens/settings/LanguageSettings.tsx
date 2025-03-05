import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const LanguageSettings = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english'); // Default language
  

  const languages = [
    { id: 'english', name: 'English' },
    { id: 'indonesian', name: 'Bahasa Indonesia' },
  ];

  const handleLanguageSelection = (languageId) => {
    setSelectedLanguage(languageId);
    // Here you would typically save the language preference to your app's state management or storage
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Select your preferred language for the app interface
        </Text>

        {languages.map((language) => (
          <TouchableOpacity
            key={language.id}
            style={styles.languageItem}
            onPress={() => handleLanguageSelection(language.id)}
          >
            <Text style={styles.languageText}>{language.name}</Text>
            {selectedLanguage === language.id && (
              <MaterialIcons name="check-circle" size={22} color="#20C997" />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#20C997',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333333',
  },
});

export default LanguageSettings;