import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FREQUENCY_OPTIONS = ["Once", "Daily", "Weekly"];
const REMINDERS_STORAGE_KEY = "@GroWell:reminders";

const AddReminderScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Date and Time
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Temporary selections for time picker
  const [tempHour, setTempHour] = useState(null);
  const [tempMinute, setTempMinute] = useState(null);
  const [tempPeriod, setTempPeriod] = useState(null);

  // Frequency
  const [frequency, setFrequency] = useState("Once");
  const [selectedDay, setSelectedDay] = useState("");

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for calendar
  const formatCalendarDate = (date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Format time for display
  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle date selection from calendar
  const handleDateSelect = (day) => {
    const selectedDate = new Date(day.dateString);
    setDate(selectedDate);
    // No autoclose, user must press confirm
  };

  // Generate hours and minutes for time picker
  const generateHours = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push(i);
    }
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i.toString().padStart(2, "0"));
    }
    return minutes;
  };

  // Initialize temp time values when opening time picker
  const openTimePicker = () => {
    const currentTimeDetails = getCurrentTimeDetails();
    setTempHour(currentTimeDetails.hour);
    setTempMinute(currentTimeDetails.minute);
    setTempPeriod(currentTimeDetails.period);
    setShowTimePicker(true);
  };

  // Handle time selection for temporary values
  const handleTempTimeSelect = (hour, minute, period) => {
    setTempHour(hour);
    setTempMinute(minute);
    setTempPeriod(period);
  };

  // Confirm time selection
  const confirmTimeSelection = () => {
    if (tempHour !== null && tempMinute !== null && tempPeriod !== null) {
      const newTime = new Date();
      const adjustedHour =
        tempPeriod === "PM" && tempHour !== 12
          ? tempHour + 12
          : tempPeriod === "AM" && tempHour === 12
          ? 0
          : tempHour;

      newTime.setHours(adjustedHour);
      newTime.setMinutes(parseInt(tempMinute));
      newTime.setSeconds(0);

      setTime(newTime);
    }
    setShowTimePicker(false);
  };

  // Weekly day selection
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Handle day selection
  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  // Format day string based on frequency
  const formatDayString = () => {
    if (frequency === "Once") {
      return formatDate(date);
    } else if (frequency === "Daily") {
      return "Daily";
    } else if (frequency === "Weekly") {
      return `Every ${selectedDay}`;
    }
    return "";
  };

  // Save reminder
  const saveReminder = async () => {
    if (!title.trim()) {
      alert("Please enter a reminder title");
      return;
    }

    if (frequency === "Weekly" && !selectedDay) {
      alert("Please select a day for weekly reminder");
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      title,
      description,
      time: formatTime(time),
      day: formatDayString(),
      frequency,
      date: frequency === "Once" ? date.toISOString() : null,
      selectedDay: frequency === "Weekly" ? selectedDay : null,
      isEnabled: true,
      notificationTime: time.toISOString(),
      notificationId: null,
    };

    try {
      // Get existing reminders
      const storedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      const existingReminders = storedReminders
        ? JSON.parse(storedReminders)
        : [];

      // Add new reminder
      const updatedReminders = [...existingReminders, newReminder];

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        REMINDERS_STORAGE_KEY,
        JSON.stringify(updatedReminders)
      );

      // Navigate back without params
      navigation.navigate("MainApp", { screen: "ReminderPage" });
    } catch (error) {
      console.error("Failed to save reminder:", error);
      alert("Could not save your reminder");
    }
  };

  // Get current hour, minute and period for time picker
  const getCurrentTimeDetails = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return {
      hour: displayHour,
      minute: minutes.toString().padStart(2, "0"),
      period,
    };
  };

  const currentTime = getCurrentTimeDetails();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={19} color="#333333" />
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
                      frequency === option && styles.activeFrequencyOption,
                    ]}
                    onPress={() => setFrequency(option)}
                  >
                    <Text
                      style={[
                        styles.frequencyText,
                        frequency === option && styles.activeFrequencyText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {frequency === "Weekly" && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Day of Week</Text>
                <View style={styles.daysContainer}>
                  {weekDays.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        selectedDay === day && styles.activeDayButton,
                      ]}
                      onPress={() => handleDayPress(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selectedDay === day && styles.activeDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {frequency === "Once" && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#666666"
                  />
                  <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={openTimePicker}
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
            animationType="none"
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

                <View style={styles.timePickerContainer}>
                  {/* Hour selection */}
                  <View style={styles.timePickerColumn}>
                    <Text style={styles.timePickerLabel}>Hour</Text>
                    <ScrollView
                      style={styles.timePickerScrollView}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.timePickerScrollContent}
                    >
                      {generateHours().map((hour) => (
                        <TouchableOpacity
                          key={`hour-${hour}`}
                          style={[
                            styles.timePickerItem,
                            tempHour === hour && styles.timePickerItemSelected,
                          ]}
                          onPress={() => {
                            handleTempTimeSelect(
                              hour,
                              tempMinute || currentTime.minute,
                              tempPeriod || currentTime.period
                            );
                          }}
                        >
                          <Text
                            style={[
                              styles.timePickerItemText,
                              tempHour === hour &&
                                styles.timePickerItemTextSelected,
                            ]}
                          >
                            {hour}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Minute selection */}
                  <View style={styles.timePickerColumn}>
                    <Text style={styles.timePickerLabel}>Minute</Text>
                    <ScrollView
                      style={styles.timePickerScrollView}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.timePickerScrollContent}
                    >
                      {generateMinutes().map((minute) => (
                        <TouchableOpacity
                          key={`minute-${minute}`}
                          style={[
                            styles.timePickerItem,
                            tempMinute === minute &&
                              styles.timePickerItemSelected,
                          ]}
                          onPress={() => {
                            handleTempTimeSelect(
                              tempHour || currentTime.hour,
                              minute,
                              tempPeriod || currentTime.period
                            );
                          }}
                        >
                          <Text
                            style={[
                              styles.timePickerItemText,
                              tempMinute === minute &&
                                styles.timePickerItemTextSelected,
                            ]}
                          >
                            {minute}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* AM/PM selection */}
                  <View style={styles.timePickerColumn}>
                    <Text style={styles.timePickerLabel}>AM/PM</Text>
                    <View style={styles.amPmContainer}>
                      <TouchableOpacity
                        style={[
                          styles.amPmButton,
                          tempPeriod === "AM" && styles.amPmButtonSelected,
                        ]}
                        onPress={() => {
                          handleTempTimeSelect(
                            tempHour || currentTime.hour,
                            tempMinute || currentTime.minute,
                            "AM"
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.amPmButtonText,
                            tempPeriod === "AM" &&
                              styles.amPmButtonTextSelected,
                          ]}
                        >
                          AM
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.amPmButton,
                          tempPeriod === "PM" && styles.amPmButtonSelected,
                        ]}
                        onPress={() => {
                          handleTempTimeSelect(
                            tempHour || currentTime.hour,
                            tempMinute || currentTime.minute,
                            "PM"
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.amPmButtonText,
                            tempPeriod === "PM" &&
                              styles.amPmButtonTextSelected,
                          ]}
                        >
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.calendarFooter}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmTimeSelection}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Date Picker Modal with Calendar */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="none"
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

                <Calendar
                  current={formatCalendarDate(date)}
                  minDate={formatCalendarDate(new Date())}
                  onDayPress={handleDateSelect}
                  markedDates={{
                    [formatCalendarDate(date)]: {
                      selected: true,
                      selectedColor: "#20C997",
                    },
                  }}
                  theme={{
                    backgroundColor: "#ffffff",
                    calendarBackground: "#ffffff",
                    textSectionTitleColor: "#666666",
                    selectedDayBackgroundColor: "#20C997",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#20C997",
                    dayTextColor: "#333333",
                    textDisabledColor: "#d9e1e8",
                    dotColor: "#20C997",
                    selectedDotColor: "#ffffff",
                    arrowColor: "#20C997",
                    monthTextColor: "#333333",
                  }}
                />

                <View style={styles.calendarFooter}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333333",
  },
  saveButton: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#20C997",
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
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#333333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  frequencyOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeFrequencyOption: {
    backgroundColor: "#E3F8F1",
  },
  frequencyText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#666666",
  },
  activeFrequencyText: {
    color: "#20C997",
    fontFamily: "PlusJakartaSans-Bold",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    margin: 4,
  },
  activeDayButton: {
    backgroundColor: "#20C997",
  },
  dayText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#666666",
  },
  activeDayText: {
    color: "#FFFFFF",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#333333",
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveReminderButton: {
    backgroundColor: "#20C997",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveReminderText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#FFFFFF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333333",
  },
  // Calendar styles
  calendarFooter: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  confirmButton: {
    backgroundColor: "#20C997",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
  },
  // Time picker styles
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  timePickerLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#666666",
    marginBottom: 10,
  },
  timePickerScrollView: {
    height: 180,
    width: "100%",
  },
  timePickerScrollContent: {
    paddingVertical: 8,
  },
  timePickerItem: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  timePickerItemSelected: {
    backgroundColor: "#E3F8F1",
  },
  timePickerItemText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#333333",
  },
  timePickerItemTextSelected: {
    color: "#20C997",
    fontFamily: "PlusJakartaSans-Bold",
  },
  amPmContainer: {
    width: "100%",
  },
  amPmButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  amPmButtonSelected: {
    backgroundColor: "#E3F8F1",
  },
  amPmButtonText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#333333",
  },
  amPmButtonTextSelected: {
    color: "#20C997",
    fontFamily: "PlusJakartaSans-Bold",
  },
});

export default AddReminderScreen;
