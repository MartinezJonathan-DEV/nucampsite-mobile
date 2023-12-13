import { useSelector, useDispatch } from "react-redux";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { SwipeRow } from "react-native-swipe-list-view";
import * as Animatable from "react-native-animatable";
import Loading from "../components/LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { toggleFavorite } from "../features/favorites/favoritesSlice";

/**
 * FavoritesScreen component displays the users favorite campsites
 * with the ability to delete favorites using swipe gestures.
 *
 * @param {Object} navigation - Navigation prop for navigating between screens.
 */
const FavoritesScreen = ({ navigation }) => {
  // Redux state and dispatch
  const { campsitesArray, isLoading, errMess } = useSelector(
    (state) => state.campsites
  );
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  /**
   * Renders an individual favorite campsite item.
   *
   * @param {Object} item - The campsite data for the rendered item.
   * @returns {JSX.Element} - Rendered component for the favorite campsite.
   */
  const renderFavoriteItem = ({ item: campsite }) => {
    return (
      <SwipeRow rightOpenValue={-100}>
        <View style={styles.deleteView}>
          <TouchableOpacity
            style={styles.deleteTouchable}
            onPress={() =>
              Alert.alert(
                "Delete Favorite?",
                "Are you sure you wish to delete the favorite campsite " +
                  campsite.name +
                  "?",
                [
                  {
                    text: "Cancel",
                    onPress: () => {
                      console.log(campsite.name + "Not Deleted");
                    },
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => dispatch(toggleFavorite(campsite.id)),
                  },
                ],
                { cancelable: false }
              )
            }
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View>
          <ListItem
            onPress={() =>
              navigation.navigate("Directory", {
                screen: "CampsiteInfo",
                params: { campsite },
              })
            }
          >
            <Avatar rounded source={{ uri: baseUrl + campsite.image }} />
            <ListItem.Content>
              <ListItem.Title>{campsite.name}</ListItem.Title>
              <ListItem.Subtitle>{campsite.description}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </View>
      </SwipeRow>
    );
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (errMess) {
    return (
      <View>
        <Text>{errMess}</Text>
      </View>
    );
  }

  // Render the FavoritesScreen
  return (
    <Animatable.View animation="fadeInRightBig" duration={2000}>
      <FlatList
        data={campsitesArray.filter((campsite) =>
          favorites.includes(campsite.id)
        )}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Animatable.View>
  );
};

// Styles for the FavoritesScreen component
const styles = StyleSheet.create({
  deleteView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  deleteTouchable: {
    backgroundColor: "red",
    height: "100%",
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    width: 100,
  },
});

export default FavoritesScreen;
