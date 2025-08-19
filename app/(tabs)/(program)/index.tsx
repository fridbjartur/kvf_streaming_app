import { scale } from "react-native-size-matters";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {
  HomeScraperItemType,
  useGetHomeScraper,
} from "@/hooks/scrapers/useGetHomeScraper";
import { VideoSlider } from "@/components/VideoSlider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

export default function ProgramScreen() {
  const { data, loading, error, refetch } = useGetHomeScraper("sjon");

  const handleMoviePress = (movie: HomeScraperItemType) => {
    return;
  };

  const handleMovieFocus = (movie: HomeScraperItemType) => {
    return;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Ionicons size={scale(200)} name="code-slash" />}
    >
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        data?.map((item) => (
          <VideoSlider
            key={item.id}
            title={item.title}
            items={item.items}
            onVideoPress={(e) =>
              router.push({
                pathname: "/(tabs)/(program)/[url]",
                params: { url: e.link },
              })
            }
          />
        ))
      )}
    </ParallaxScrollView>
  );
}
