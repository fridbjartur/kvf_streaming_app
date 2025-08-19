import React from "react";
import {
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { scale } from "react-native-size-matters";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGetHomeScraper } from "@/hooks/scrapers/useGetHomeScraper";
import { useGetItemScraper } from "@/hooks/scrapers/useGetItemScraper";

export function WebScraperDemo() {
  // const { data, loading, error, refetch } = useGetHomeScraper();
  const { data: itemData } = useGetItemScraper(
    "https://kvf.fo/sjon/sending/painted-fire-gudrid-hansdottir-i-talu-og-tonum"
  );

  console.log(itemData);

  // if (loading) {
  //   return <ThemedText style={styles.statusText}>Loading...</ThemedText>;
  // }

  // if (error) {
  //   return <ThemedText style={styles.errorText}>Error: {error}</ThemedText>;
  // }

  return (
    <ThemedView>
      {/* {data?.map((d) => (
        <ThemedView>
          <ThemedText type="subtitle">{d.title}</ThemedText>
          <ThemedView>
            {d.items.map((i) => (
              <TouchableOpacity>
                <ThemedText>{i.title}</ThemedText>
                <Image
                  source={{ uri: i.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <ThemedText type="small">{i.link}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
      ))} */}
    </ThemedView>
    // <ThemedView style={styles.container}>
    //   <ThemedText type="subtitle">KVF Web Scraper Demo</ThemedText>

    //   <Pressable onPress={refetch} style={styles.refetchButton}>
    //     <ThemedText type="defaultSemiBold">Refresh Data</ThemedText>
    //   </Pressable>

    //   {loading && <ThemedText style={styles.statusText}>Loading...</ThemedText>}

    //   {error && (
    //     <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
    //   )}

    //   {data && (
    //     <ThemedView style={styles.resultsContainer}>
    //       <ThemedText type="defaultSemiBold" style={styles.resultsTitle}>
    //         Found {data.length} view-grouping sections:
    //       </ThemedText>

    //       {data.map((section, sectionIndex) => (
    //         <ThemedView key={sectionIndex} style={styles.sectionContainer}>
    //           <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
    //             {sectionIndex + 1}. {section.title} ({section.items.length}{" "}
    //             items)
    //           </ThemedText>

    //           {section.items.map((item, itemIndex) => (
    //             <ThemedView key={itemIndex} style={styles.itemContainer}>
    //               <ThemedText style={styles.itemTitle}>
    //                 • {item.title || item.link.split("/").pop() || "No title"}
    //               </ThemedText>
    //               {item.image && (
    //                 <Image
    //                   source={{ uri: item.image }}
    //                   style={styles.itemImage}
    //                   resizeMode="cover"
    //                 />
    //               )}
    //             </ThemedView>
    //           ))}
    //         </ThemedView>
    //       ))}
    //     </ThemedView>
    //   )}
    // </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "600%",
  },
  refetchButton: {
    backgroundColor: "#007AFF",
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: "center",
  },
  statusText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    color: "#FF3B30",
    padding: scale(8),
    backgroundColor: "#FFE5E5",
    borderRadius: scale(4),
  },
  resultsContainer: {
    gap: scale(8),
  },
  resultsTitle: {
    textAlign: "center",
    marginBottom: scale(8),
  },
  sectionContainer: {
    marginBottom: scale(16),
    padding: scale(8),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: scale(4),
  },
  sectionTitle: {
    marginBottom: scale(8),
    color: "#007AFF",
  },
  itemContainer: {
    marginLeft: scale(16),
    marginBottom: scale(8),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  itemTitle: {
    fontSize: scale(12),
    lineHeight: scale(16),
    flex: 1,
  },
  itemImage: {
    width: scale(40),
    height: scale(30),
    borderRadius: scale(2),
  },
});
