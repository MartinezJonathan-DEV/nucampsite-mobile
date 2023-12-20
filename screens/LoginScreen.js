import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { CheckBox, Input, Button, Icon } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { baseUrl } from "../shared/baseUrl";
import logo from "../assets/images/logo.png";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";

/**
 * LoginTab component provides a login form with username, password, and remember me checkbox.
 * @param {Object} navigation - Navigation object for navigating between screens.
 */
const LoginTab = ({ navigation }) => {
  // State variables for handling user input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  /**
   * Handles the login process.
   * Saves user info in SecureStore if "Remember Me" is checked.
   */
  const handleLogin = () => {
    console.log("username:", username);
    console.log("password:", password);
    console.log("remember:", remember);

    // Save user info in SecureStore if "Remember Me" is checked
    if (remember) {
      SecureStore.setItemAsync(
        "userinfo",
        JSON.stringify({
          username,
          password,
        })
      ).catch((error) => console.log("Could not save user info", error));
    } else {
      // Delete user info from SecureStore if "Remember Me" is unchecked
      SecureStore.deleteItemAsync("userinfo").catch((error) =>
        console.log("Could not delete user info", error)
      );
    }
  };

  // Load saved user info on component mount
  useEffect(() => {
    SecureStore.getItemAsync("userinfo").then((userdata) => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        setUsername(userinfo.username);
        setPassword(userinfo.password);
        setRemember(true);
      }
    });
  }, []);

  // Render the login form.
  return (
    <View style={styles.container}>
      <Input
        placeholder="Username"
        leftIcon={{ type: "font-awesome", name: "user-o" }}
        onChangeText={(text) => setUsername(text)}
        value={username}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: "font-awesome", name: "key" }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <CheckBox
        title="Remember Me"
        center
        checked={remember}
        onPress={() => setRemember(!remember)}
        containerStyle={styles.formCheckbox}
      />
      <View style={styles.formButton}>
        <Button
          onPress={() => handleLogin()}
          title="Login"
          color="#5637DD"
          icon={
            <Icon
              name="sign-in"
              type="font-awesome"
              color="#fff"
              iconStyle={{ marginRight: 10 }}
            />
          }
          buttonStyle={{ backgroundColor: "#5637DD" }}
        />
      </View>
      <View style={styles.formButton}>
        <Button
          onPress={() => navigation.navigate("Register")}
          title="Register"
          type="clear"
          icon={
            <Icon
              name="user-plus"
              type="font-awesome"
              color="blue"
              iconStyle={{ marginRight: 10 }}
            />
          }
          titleStyle={{ color: "blue" }}
        />
      </View>
    </View>
  );
};

/**
 * The `RegisterTab` component renders a user registration form.
 * It includes input fields for username, password, first name, last name, email,
 * and a "Remember Me" checkbox.
 */
const RegisterTab = () => {
  // State variables to manage user input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [imageUrl, setImageUrl] = useState(baseUrl + "images/logo.png");

  /**
   * Handles the user registration process.
   * It collects user information, logs it, and saves it securely if "Remember Me" is checked.
   */
  const handleRegister = () => {
    // Store user input
    const userInfo = {
      username,
      password,
      firstName,
      lastName,
      email,
      remember,
    };
    console.log(JSON.stringify(userInfo));

    // Save user info in SecureStore if "Remember Me" is checked
    if (remember) {
      SecureStore.setItemAsync(
        "userinfo",
        JSON.stringify({
          username,
          password,
        })
      ).catch((error) => console.log("Could not save user info", error));
    } else {
      // Delete user info from SecureStore if "Remember Me" is unchecked
      SecureStore.deleteItemAsync("userinfo").catch((error) =>
        console.log("Could not delete user info", error)
      );
    }
  };

  /**
   * Launches the device camera to capture an image and sets it as the user's profile picture.
   * Requires camera permissions.
   */
  const getImageFromCamera = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    // Check if camera permissions are granted
    if (cameraPermission.status === "granted") {
      // Launch camera to capture an image
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      // Set the captured image as the user's profile picture
      if (capturedImage.assets) {
        console.log(capturedImage.assets[0]);
        const processedImage = await processImage(capturedImage.assets[0].uri);
        setImageUrl(processedImage);

        // Save image to library
        MediaLibrary.saveToLibraryAsync(capturedImage.assets[0]);
      }
    }
  };

  /**
   * Processes the selected image by resizing it and converting it to PNG format.
   * The processed image URI is then set as the user's profile picture.
   *
   * @param {string} imgUri - The URI of the image to be processed.
   */
  const processImage = async (imgUri) => {
    // Resize and convert the image to PNG format
    const processedImage = await ImageManipulator.manipulateAsync(
      imgUri,
      [{ resize: { width: 400 } }],
      { format: ImageManipulator.SaveFormat.PNG }
    );
    console.log(processedImage);

    // Set the processed image as the user's profile picture
    setImageUrl(processedImage.uri);
  };

  /**
   * Launches the device's image gallery to select an image.
   * The selected image is then processed and set as the user's profile picture.
   * Requires media library permissions.
   */
  const getImageFromGallery = async () => {
    // Request media library permissions
    const mediaLibraryPermissions =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    // Check if media library permissions are granted
    if (mediaLibraryPermissions.status === "granted") {
      // Launch image gallery to select an image
      const capturedImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      // Process and set the selected image as the users profile picture
      if (capturedImage.assets) {
        console.log(capturedImage.assets[0]);
        processImage(capturedImage.assets[0].uri);
      }
    }
  };

  // Render registration form
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            loadingIndicatorSource={logo}
            style={styles.image}
          />
          <Button title="Camera" onPress={getImageFromCamera} />
          <Button title="Gallery" onPress={getImageFromGallery} />
        </View>
        <Input
          placeholder="Username"
          leftIcon={{ type: "font-awesome", name: "user-o" }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: "font-awesome", name: "key" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder="First Name"
          leftIcon={{ type: "font-awesome", name: "user-o" }}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder="Last Name"
          leftIcon={{ type: "font-awesome", name: "user-o" }}
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder="Email"
          leftIcon={{ type: "font-awesome", name: "envelope-o" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <CheckBox
          title="Remember Me"
          center
          checked={remember}
          onPress={() => setRemember(!remember)}
          containerStyle={styles.formCheckbox}
        />
        <View style={styles.formButton}>
          <Button
            onPress={() => handleRegister()}
            title="Register"
            color="#5637DD"
            icon={
              <Icon
                name="user-plus"
                type="font-awesome"
                color="#fff"
                iconStyle={{ marginRight: 10 }}
              />
            }
            buttonStyle={{ backgroundColor: "#5637DD" }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * LoginScreen component displays a tab navigator with login and registration tabs.
 */
const Tab = createBottomTabNavigator();

const LoginScreen = () => {
  // Options for the tab bar appearance
  const tabBarOptions = {
    activeBackgroundColor: "#5637DD",
    inactiveBackgroundColor: "#CEC8FF",
    activeTintColor: "#fff",
    inactiveTintColor: "#808080",
    labelStyle: { fontSize: 16 },
  };

  return (
    <Tab.Navigator tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="Login"
        component={LoginTab}
        options={{
          tabBarIcon: (props) => {
            return (
              <Icon name="sign-in" type="font-awesome" color={props.color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterTab}
        options={{
          tabBarIcon: (props) => {
            return (
              <Icon name="user-plus" type="font-awesome" color={props.color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 10,
  },
  formIcon: {
    marginRight: 10,
  },
  formInput: {
    padding: 8,
    height: 60,
  },
  formCheckbox: {
    margin: 8,
    backgroundColor: null,
  },
  formButton: {
    margin: 20,
    marginRight: 40,
    marginLeft: 40,
  },
  imageContainer: {
    fex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
});

export default LoginScreen;
