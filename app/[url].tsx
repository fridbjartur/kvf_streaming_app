import { scale } from "react-native-size-matters";
import { useLocalSearchParams, router } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGetItemScraper } from "@/hooks/scrapers/useGetItemScraper";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import VideoPlayer from "@/components/VideoPlayer";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { VideoItem } from "@/components/VideoSlider";
import { useState } from "react";
import { HomeScraperItemType } from "@/hooks/scrapers/useGetHomeScraper";

const { width } = Dimensions.get("window");
const numColumns = 4;
const itemWidth = (width - scale(80)) / numColumns; // Account for padding and gap

export default function DetailScreen() {
  const { url } = useLocalSearchParams();
  const urlString = Array.isArray(url) ? url[0] : url;

  const { data, loading, error, refetch } = useGetItemScraper(urlString);

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleMovieFocus = (index: number, movie: HomeScraperItemType) => {
    setFocusedIndex(index);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Ionicons size={scale(200)} name="code-slash" />}
    >
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <ThemedView style={styles.container}>
          <VideoPlayer
            source={data?.m3u8Url || ""}
            onFocus={() => console.log("focus")}
            onBlur={() => console.log("blur")}
          >
            <ThemedText>HIiiiii</ThemedText>
          </VideoPlayer>

          {data?.episodes && data.episodes.length > 0 && (
            <ThemedView style={styles.episodesSection}>
              <ThemedText style={[styles.sectionTitle]}>Episodes</ThemedText>
              <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.episodesGrid}
              >
                {data?.episodes?.map((e, index) => (
                  <VideoItem
                    key={e.id}
                    video={e}
                    isFocused={focusedIndex === index}
                    onFocus={() => handleMovieFocus(index, e)}
                    onPress={() =>
                      router.push({
                        pathname: "/[url]",
                        params: { url: e.link },
                      })
                    }
                  />
                ))}
              </ScrollView>
            </ThemedView>
          )}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  episodesSection: {
    marginTop: scale(20),
    paddingHorizontal: scale(20),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    marginBottom: scale(15),
  },
  episodesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: scale(15),
  },
  episodeItem: {
    width: itemWidth,
    borderRadius: scale(8),
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  episodeImage: {
    width: "100%",
    height: scale(120),
  },
  episodeContent: {
    padding: scale(12),
  },
  episodeTitle: {
    fontSize: scale(14),
    fontWeight: "600",
    marginBottom: scale(4),
    lineHeight: scale(18),
  },
  episodeSummary: {
    fontSize: scale(12),
    marginBottom: scale(6),
    lineHeight: scale(16),
    opacity: 0.8,
  },
  episodeDate: {
    fontSize: scale(11),
    opacity: 0.6,
  },
});
