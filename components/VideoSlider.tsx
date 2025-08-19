import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { scale } from "react-native-size-matters";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HomeScraperItemType } from "@/hooks/scrapers/useGetHomeScraper";

export interface VideoSliderProps {
  title: string;
  items: HomeScraperItemType[];
  onVideoPress?: (e: HomeScraperItemType) => void;
  onVideoFocus?: (e: HomeScraperItemType) => void;
  style?: any;
}

export function VideoSlider({
  title,
  items,
  onVideoPress,
  onVideoFocus,
  style,
}: VideoSliderProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleVideoFocus = (index: number, e: HomeScraperItemType) => {
    setFocusedIndex(index);
    onVideoFocus?.(e);
  };

  const handleVideoPress = (e: HomeScraperItemType) => {
    onVideoPress?.(e);
  };

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {items.map((item, index) => (
          <VideoItem
            key={item.id}
            video={item}
            isFocused={focusedIndex === index}
            onPress={() => handleVideoPress(item)}
            onFocus={() => handleVideoFocus(index, item)}
            style={styles.videoItem}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

interface VideoItemProps {
  video: HomeScraperItemType;
  isFocused: boolean;
  onPress: () => void;
  onFocus: () => void;
  style?: any;
}

export function VideoItem({
  video,
  isFocused,
  onPress,
  onFocus,
  style,
}: VideoItemProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  return (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      style={[
        styles.videoItemContainer,
        {
          backgroundColor: isFocused ? tintColor : backgroundColor,
        },
        style,
      ]}
      {...(Platform.OS === "ios" || Platform.OS === "android"
        ? {
            focusable: true,
            hasTVPreferredFocus: false,
          }
        : {})}
    >
      <View style={styles.posterContainer}>
        {video.image ? (
          <Image
            source={{ uri: video.image }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View style={styles.videoInfo}>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.videoTitle,
            { color: isFocused ? backgroundColor : textColor },
          ]}
          numberOfLines={2}
        >
          {video.title}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: scale(16),
  },
  title: {
    marginBottom: scale(12),
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {},
  videoItem: {
    marginRight: scale(10),
  },
  videoItemContainer: {
    borderRadius: scale(8),
    width: scale(140),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  posterContainer: {
    height: scale(90),
    overflow: "hidden",
    borderRadius: scale(8),
    position: "relative",
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  videoInfo: {
    padding: scale(12),
  },
  videoTitle: {},
});
