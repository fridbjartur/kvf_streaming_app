import React from "react";
import { StyleSheet, Alert } from "react-native";
import { scale } from "react-native-size-matters";

import { VideoSlider } from "./VideoSlider";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import {
  HomeScraperItemType,
  useGetHomeScraper,
} from "@/hooks/scrapers/useGetHomeScraper";

const sampleMovies: HomeScraperItemType[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    link: "https://www.imdb.com/title/tt0111161/",
  },
  {
    id: "2",
    title: "The Godfather",
    image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    link: "https://www.imdb.com/title/tt0068646/",
  },
  {
    id: "3",
    title: "The Dark Knight",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    link: "https://www.imdb.com/title/tt1345836/",
  },
  {
    id: "4",
    title: "Pulp Fiction",
    image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    link: "https://www.imdb.com/title/tt0110912/",
  },
  {
    id: "5",
    title: "Fight Club",
    image: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    link: "https://www.imdb.com/title/tt0137523/",
  },
  {
    id: "6",
    title: "Inception",
    image: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    link: "https://www.imdb.com/title/tt1375666/",
  },
];

const actionMovies: HomeScraperItemType[] = [
  {
    id: "7",
    title: "Mad Max: Fury Road",
    image: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroR2dfP.jpg",
    link: "https://www.imdb.com/title/tt1392190/",
  },
  {
    id: "8",
    title: "John Wick",
    image: "https://image.tmdb.org/t/p/w500/5vHssUeVe25bMrof1HyaPyWgaP.jpg",
    link: "https://www.imdb.com/title/tt2911616/",
  },
  {
    id: "9",
    title: "Mission: Impossible - Fallout",
    image: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1N0LcGLW.jpg",
    link: "https://www.imdb.com/title/tt4912910/",
  },
  {
    id: "10",
    title: "The Matrix",
    image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    link: "https://www.imdb.com/title/tt0133093/",
  },
  {
    id: "11",
    title: "Die Hard",
    image: "https://image.tmdb.org/t/p/w500/7SPhr7Qj39czxYg1kH3oqpKuplb.jpg",
    link: "https://www.imdb.com/title/tt0103064/",
  },
];

const comedyMovies: HomeScraperItemType[] = [
  {
    id: "12",
    title: "The Grand Budapest Hotel",
    image: "https://image.tmdb.org/t/p/w500/eWdyYQreja6hjGCnxoGZkFboUTb.jpg",
    link: "https://www.imdb.com/title/tt2278388/",
  },
  {
    id: "13",
    title: "Superbad",
    image: "https://image.tmdb.org/t/p/w500/4YzJ5wdgJZzVJtQdQbqj8q8q8q8q.jpg",
    link: "https://www.imdb.com/title/tt1322266/",
  },
  {
    id: "14",
    title: "Shaun of the Dead",
    image: "https://image.tmdb.org/t/p/w500/8kM9pzEaSncz5otC6ocOKpx32Oi.jpg",
    link: "https://www.imdb.com/title/tt0462538/",
  },
  {
    id: "15",
    title: "The Big Lebowski",
    image: "https://image.tmdb.org/t/p/w500/aHaVjVoXeNanfwUwQ92SG7tosFM.jpg",
    link: "https://www.imdb.com/title/tt0118715/",
  },
];

export function VideoSliderDemo() {
  const { data, loading, error, refetch } = useGetHomeScraper("vit");

  const handleMoviePress = (movie: HomeScraperItemType) => {
    Alert.alert(movie.title, `${movie.link}`, [{ text: "OK" }]);
  };

  const handleMovieFocus = (movie: HomeScraperItemType) => {
    // You can add additional logic here when a movie gets focus
    // For example, preload movie details, update UI, etc.
    console.log("Focused on:", movie.title);
  };

  return (
    <ThemedView style={styles.container}>
      {data?.map((item) => (
        <VideoSlider key={item.id} title={item.title} items={item.items} />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: scale(20),
  },
  header: {
    textAlign: "center",
    marginBottom: scale(20),
  },
});
