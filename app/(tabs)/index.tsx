import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons
          size={scale(200)}
          name="code-slash"
          style={styles.headerImage}
        />
      }
    >
      <ThemedText>Hello</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: scale(-30),
    left: 0,
    position: "absolute",
  },
});
