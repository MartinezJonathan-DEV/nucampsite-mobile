import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Switch,
  Button,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";

// ReservationScreen component handles user input for campsite reservations
const ReservationScreen = () => {
  // State variables to track user input
  const [campers, setCampers] = useState(1);
  const [hikeIn, setHikeIn] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showCalender, setShowCalender] = useState(false);

  // Function to handle date change in the DateTimePicker
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowCalender(Platform.OS === "ios");
    setDate(currentDate);
  };

  /**
   * Handles the campsite reservation process.
   * Displays an alert for confirmation and triggers a local notification on confirmation.
   */
  const handleReservation = () => {
    console.log("campers:", campers);
    console.log("hikeIn:", hikeIn);
    console.log("date:", date);

    // Display an Alert with reservation details
    Alert.alert(
      "Begin Search?",
      `Number of Campers: ${campers}\n\nHike-In: ${hikeIn}\n\nDate: ${date.toLocaleDateString(
        "en-us"
      )}`,
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("canceled");
            resetForm();
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // Trigger local notification on confirmation
            presentLocalNotification(date.toLocaleDateString("en-us"));
            resetForm();
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Function to reset the form to its initial state
  const resetForm = () => {
    setCampers(1);
    setHikeIn(false);
    setDate(new Date());
    setShowCalender(false);
  };

  /**
   * Presents a local notification for the campsite reservation search.
   *
   * @param {Date} reservationDate - The date for which the campsite reservation search is requested.
   */
  const presentLocalNotification = async (reservationDate) => {
    // Sends the notification
    const sendNotification = () => {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Schedule notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Your Campsite Reservations Search",
          body: `Search for ${reservationDate} requested`,
        },
        trigger: null,
      });
    };

    // Get notification permissions
    let permissions = await Notifications.getPermissionsAsync();

    // Request permissions if not granted
    if (!permissions.granted) {
      permissions = await Notifications.requestPermissionsAsync();
    }

    // Send notification if permissions are granted
    if (permissions.granted) {
      sendNotification();
    }
  };

  return (
    <ScrollView>
      <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Campers:</Text>
          <Picker
            style={styles.formItem}
            selectedValue={campers}
            onValueChange={(itemValue) => setCampers(itemValue)}
          >
            <Picker.Item label="1" value={1} />
            <Picker.Item label="2" value={2} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
            <Picker.Item label="6" value={6} />
          </Picker>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Hike In?</Text>
          <Switch
            style={styles.formItem}
            value={hikeIn}
            trackColor={{ true: "#5637DD", false: null }}
            onValueChange={(value) => setHikeIn(value)}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date:</Text>
          <Button
            onPress={() => setShowCalender(!showCalender)}
            title={date.toLocaleDateString("en-us")}
            color="#5637DD"
            accessibilityLabel="Tap me to select a reservation date"
          />
        </View>
        {showCalender && (
          <DateTimePicker
            style={styles.formItem}
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <View style={styles.formRow}>
          <Button
            onPress={() => {
              handleReservation();
            }}
            title="Search Availabiltiy"
            color="#5637DD"
            accessibilityLabel="Tap me to search for available campsites to reserve"
          />
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

// Styles for the ReservationScreen component
const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
});

export default ReservationScreen;
