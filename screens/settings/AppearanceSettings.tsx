import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const AppearanceSettings = ({ navigation }) => {
  const { isDarkMode, toggleTheme, setThemeMode, themeMode, colors } = useTheme();

  const selectTheme = (theme) => {
    setThemeMode(theme);
  };

  // Dynamic styles with theme colors
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    headerTitle: {
      fontSize: 22,
      fontFamily: 'PlusJakartaSans-Bold',
      color: colors.primary,
    },
    backIcon: {
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'PlusJakartaSans-Bold',
      color: colors.text,
      marginBottom: 15,
    },
    optionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    optionText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Medium',
      color: colors.text,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    themeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    themeText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Medium',
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} style={dynamicStyles.backIcon} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Theme</Text>
          
          <View style={dynamicStyles.optionItem}>
            <Text style={dynamicStyles.optionText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#D9D9D9", true: "#A7E8D4" }}
              thumbColor={isDarkMode ? "#20C997" : "#F5F5F5"}
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Theme Selection</Text>
          
          <TouchableOpacity 
            style={dynamicStyles.themeOption}
            onPress={() => selectTheme('system')}
          >
            <View style={styles.themeOptionContent}>
              <View style={dynamicStyles.themeIconContainer}>
                <MaterialIcons name="settings-system-daydream" size={22} color="#20C997" />
              </View>
              <Text style={dynamicStyles.themeText}>System Default</Text>
            </View>
            {themeMode === 'system' && (
              <MaterialIcons name="check-circle" size={22} color="#20C997" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dynamicStyles.themeOption}
            onPress={() => selectTheme('light')}
          >
            <View style={styles.themeOptionContent}>
              <View style={dynamicStyles.themeIconContainer}>
                <MaterialIcons name="wb-sunny" size={22} color="#20C997" />
              </View>
              <Text style={dynamicStyles.themeText}>Light</Text>
            </View>
            {themeMode === 'light' && (
              <MaterialIcons name="check-circle" size={22} color="#20C997" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dynamicStyles.themeOption}
            onPress={() => selectTheme('dark')}
          >
            <View style={styles.themeOptionContent}>
              <View style={dynamicStyles.themeIconContainer}>
                <MaterialIcons name="nightlight-round" size={22} color="#20C997" />
              </View>
              <Text style={dynamicStyles.themeText}>Dark</Text>
            </View>
            {themeMode === 'dark' && (
              <MaterialIcons name="check-circle" size={22} color="#20C997" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Static styles that don't depend on theme
const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AppearanceSettings;