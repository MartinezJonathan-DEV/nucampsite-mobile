// Importing required modules and components
import { useEffect } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Icon } from "react-native-elements";
import logo from "../assets/images/logo.png";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";

// Importing screen components
import CampsiteInfoScreen from "./CampsiteInfoScreen";
import DirectoryScreen from "./DirectoryScreen";
import HomeScreen from "./HomeScreen";
import AboutScreen from "./AboutScreen";
import ContactScreen from "./ContactScreen";
import ReservationScreen from "./ReservationScreen";
import FavoritesScreen from "./FavoritesScreen";
import LoginScreen from "./LoginScreen";

// Importing Redux-related functions
import { fetchPartners } from "../features/partners/partnersSlice";
import { fetchCampsites } from "../features/campsites/campsitesSlice";
import { fetchPromotions } from "../features/promotions/promotionsSlice";
import { fetchComments } from "../features/comments/commentsSlice";
import { useDispatch } from "react-redux";

// Create Drawer navigator
const Drawer = createDrawerNavigator();

// Shared screen options for the Stack Navigator
const screenOptions = {
  headerTintColor: "#fff",
  headerStyle: { backgroundColor: "#5637DD" },
};

// Home Navigator
const HomeNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Home",
          headerLeft: () => (
            <Icon
              name="home"
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

// Directory Navigator
const DirectoryNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Directory" screenOptions={screenOptions}>
      <Stack.Screen
        name="Directory"
        component={DirectoryScreen}
        options={({ navigation }) => ({
          title: "Campsites Directory",
          headerLeft: () => (
            <Icon
              name="list"
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CampsiteInfo"
        component={CampsiteInfoScreen}
        options={{ title: "Directory" }}
      />
    </Stack.Navigator>
  );
};

// About Navigator
const AboutNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Icon
              name="info-circle"
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

// Contact Navigator
const ContactNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={({ navigation }) => ({
          title: "Contact Us",
          headerLeft: () => (
            <Icon
              name="address-card"
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

// Reservation Navigator
const ReservationNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Reservation"
        component={ReservationScreen}
        options={({ navigation }) => ({
          title: "Reservation Search",
          headerLeft: () => (
            <Icon
              name="tree"
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

// Favorites Navigator
const FavoritesNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={({ navigation }) => ({
          title: "Favorites Campsites",
          headerLeft: () => (
            <Icon
              name="heart"
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

// Login Navigator
const LoginNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation, route }) => ({
          // Set header title dynamically based on the focused route
          headerTitle: getFocusedRouteNameFromRoute(route),
          // Set header left icon based on the focused route
          headerLeft: () => (
            <Icon
              name={
                getFocusedRouteNameFromRoute(route) === "Register"
                  ? "user-plus"
                  : "sign-in"
              }
              type="font-awesome"
              iconStyle={styles.stackIcon}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

/**
 * Custom Drawer Content component to be displayed in the drawer.
 * Overrides the default DrawerContentScrollView and DrawerItemList components.
 * @param {Object} props - Props passed to the component.
 * @returns {JSX.Element} - Customized Drawer content.
 */
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <View style={{ flex: 1 }}>
        <Image source={logo} style={styles.drawerImage} />
      </View>
      <View style={{ flex: 2 }}>
        <Text style={styles.drawerHeaderText}>NuCamp</Text>
      </View>
    </View>
    <DrawerItemList {...props} labelStyle={{ fontWeight: "bold" }} />
  </DrawerContentScrollView>
);

/**
 * Main component that renders the entire application.
 * Initializes the Drawer Navigator and fetches data using Redux.
 * @returns {JSX.Element} - Main application component.
 */
const Main = () => {
  const dispatch = useDispatch();

  // Fetch data using Redux actions when the component mounts.
  useEffect(() => {
    dispatch(fetchCampsites());
    dispatch(fetchPromotions());
    dispatch(fetchPartners());
    dispatch(fetchComments());
  }, [dispatch]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
      }}
    >
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={CustomDrawerContent}
        drawerStyle={{ backgroundColor: "#CEC8FF" }}
      >
        <Drawer.Screen
          name="Login"
          component={LoginNavigator}
          options={{
            drawerIcon: ({ color }) => (
              <Icon
                name="sign-in"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Home"
          component={HomeNavigator}
          options={{
            title: "Home",
            drawerIcon: ({ color }) => (
              <Icon
                name="home"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Directory"
          component={DirectoryNavigator}
          options={{
            title: "Campsite Directory",
            drawerIcon: ({ color }) => (
              <Icon
                name="list"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Reserve Campsite"
          component={ReservationNavigator}
          options={{
            title: "Reserve Campsite",
            drawerIcon: ({ color }) => (
              <Icon
                name="tree"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Favorites"
          component={FavoritesNavigator}
          options={{
            title: "My Favorites",
            drawerIcon: ({ color }) => (
              <Icon
                name="heart"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="About"
          component={AboutNavigator}
          options={{
            title: "About",
            drawerIcon: ({ color }) => (
              <Icon
                name="info-circle"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Contact"
          component={ContactNavigator}
          options={{
            title: "Contact Us",
            drawerIcon: ({ color }) => (
              <Icon
                name="address-card"
                type="font-awesome"
                size={24}
                iconStyle={{ width: 24 }}
                color={color}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#5637DD",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  drawerHeaderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  drawerImage: {
    margin: 10,
    height: 60,
    width: 60,
  },
  stackIcon: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 24,
  },
});

export default Main;
