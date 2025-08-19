import { scale } from "react-native-size-matters";
import { useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGetItemScraper } from "@/hooks/scrapers/useGetItemScraper";
import { ThemedText } from "@/components/ThemedText";

export default function DetailScreen() {
  const { url } = useLocalSearchParams();
  const urlString = Array.isArray(url) ? url[0] : url;

  const { data, loading, error, refetch } = useGetItemScraper(urlString);

  console.log(data);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Ionicons size={scale(200)} name="code-slash" />}
    >
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <ThemedText>{data?.title}</ThemedText>
      )}
    </ParallaxScrollView>
  );
}
