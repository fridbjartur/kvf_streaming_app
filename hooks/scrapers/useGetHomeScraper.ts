import { fetchWithProxy } from "@/helpers/fetchWithProxy";
import { useState, useEffect, useCallback } from "react";

// @ts-ignore - react-native-cheerio doesn't have proper TypeScript declarations
import * as cheerio from "react-native-cheerio";

export type HomeScraperItemType = {
  id: string;
  title: string;
  link: string;
  image: string;
};

export type HomeScraperDataType = {
  id: string;
  title: string;
  items: HomeScraperItemType[];
};

interface UseGetHomeScraperReturnProps {
  data: HomeScraperDataType[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetHomeScraper(
  type: "sjon" | "vit" | "miks"
): UseGetHomeScraperReturnProps {
  let url = "";
  if (type === "sjon") {
    url = "https://kvf.fo/sjon";
  } else if (type === "vit") {
    url = "https://kvf.fo/sjon/vit";
  } else if (type === "miks") {
    url = "https://kvf.fo/sjon/miks";
  }
  const [data, setData] = useState<HomeScraperDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const html = await fetchWithProxy(url);

      // Parse HTML with react-native-cheerio
      const $ = cheerio.load(html);

      // Find all view-grouping sections
      const scrapedData: HomeScraperDataType[] = [];
      const seenTitles = new Set<string>(); // Track seen titles to avoid duplicates

      // Look for view-grouping sections
      $(".view-grouping").each((index: number, element: any) => {
        const $element = $(element);

        // Find the h3 title within this view-grouping
        const title = $element.find("h3").first().text().trim();

        if (title && !seenTitles.has(title)) {
          seenTitles.add(title); // Mark this title as seen

          const items: HomeScraperItemType[] = [];

          // Find all swiper-row elements within this view-grouping (these are the actual items)
          $element
            .find(".swiper-row")
            .each((slideIndex: number, slideElement: any) => {
              const $slide = $(slideElement);

              const title =
                $slide.find(".views-field-title-1 a").first().text().trim() ||
                "";

              // Get the first link (href) from the title field
              const link =
                $slide.find(".field-content a").first().attr("href") || "";

              // Get the first image (src) from the image field
              const image = $slide.find("img").first().attr("src") || "";

              items.push({
                id: `${Date.now()}-${Math.random()}`,
                title,
                link: link.startsWith("http") ? link : `https://kvf.fo${link}`,
                image: image.startsWith("http")
                  ? image
                  : `https://kvf.fo${image}`,
              });
            });

          if (items.length) {
            scrapedData.push({
              id: `${Date.now()}-${Math.random()}`,
              title,
              items,
            });
          }
        }
      });
      setData(scrapedData);
    } catch (err) {
      console.error("Scraping error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred while scraping"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
