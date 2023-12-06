import { useRef } from "react";
import { StyleSheet, Text, View, PanResponder, Alert } from "react-native";
import { Card, Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { baseUrl } from "../../shared/baseUrl";

// RenderCampsite component displays details of a campsite in a card
const RenderCampsite = (props) => {
  const { campsite } = props;

  // Create a useRef to reference the Animatable.View component
  const view = useRef();

  // Function to check if the gesture is a left swipe
  const isLeftSwipe = ({ dx }) => dx < -200;

  // PanResponder setup for handling gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    // Trigger an animation when the gesture starts
    onPanResponderGrant: () => {
      // Apply the rubberBand animation to the component
      view.current
        .rubberBand(1000)
        .then((endState) =>
          console.log(endState.finished ? " finished" : "canceled")
        );
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end: ", gestureState);

      // Check for a left swipe and alert the user to add to favorites
      if (isLeftSwipe(gestureState)) {
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + campsite.name + " to favorites?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => console.log("Cancel Pressed"),
            },
            {
              text: "OK",
              onPress: () =>
                props.isFavorite
                  ? console.log("Already set as a favorite")
                  : props.markFavorite(),
            },
          ],
          { cancelable: false }
        );
      }
    },
  });

  // Check if the campsite object exists
  if (campsite) {
    // Animate the card's entrance using Animatable.View
    return (
      <Animatable.View
        animation="fadeInDownBig"
        duration={2000}
        delay={1000}
        {...panResponder.panHandlers}
        ref={view}
      >
        <Card containerStyle={styles.cardContainer}>
          <Card.Image source={{ uri: baseUrl + campsite.image }}>
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Text style={styles.cardText}>{campsite.name}</Text>
            </View>
          </Card.Image>
          <Text style={{ margin: 20 }}>{campsite.description}</Text>
          <View style={styles.cardRow}>
            <Icon
              name={props.isFavorite ? "heart" : "heart-o"}
              type="font-awesome"
              color="#f50"
              raised
              reverse
              onPress={() =>
                props.isFavorite
                  ? console.log("already set as a favorite")
                  : props.markFavorite()
              }
            />
            <Icon
              name="pencil"
              type="font-awesome"
              color="#5637DD"
              raised
              reverse
              onPress={() => props.onShowModal()}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  }
  // Return an empty view if the campsite object is not available
  return <View />;
};

// Styles for the RenderCampsite component
const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    margin: 0,
    marginBottom: 20,
  },
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  cardText: {
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
});

export default RenderCampsite;
