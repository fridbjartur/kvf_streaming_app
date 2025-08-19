import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import VideoPlayer from "@/components/VideoPlayer";

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
      <VideoPlayer source="https://play.kringvarp.fo/redirect/kvf/_definst_/1080_high.stream?type=m3u8" />
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
