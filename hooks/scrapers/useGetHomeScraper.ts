import { fetchWithProxy } from "@/helpers/fetchWithProxy";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

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
  isStale: boolean;
}

type HomeScraperType = "sjon" | "vit" | "miks";

// URL mapping for better maintainability
const URL_MAP = {
  sjon: "https://kvf.fo/sjon",
  vit: "https://kvf.fo/sjon/vit",
  miks: "https://kvf.fo/sjon/miks",
} as const;

// Memoized parsing function to avoid recreating on every render
const parseHtmlContent = (
  html: string,
  type: HomeScraperType
): HomeScraperDataType[] => {
  const $ = cheerio.load(html);
  const scrapedData: HomeScraperDataType[] = [];
  const seenTitles = new Set<string>();

  $(`.${type === "miks" ? "view-mix-banner-fake" : "view-grouping"}`).each(
    (index: number, element: any) => {
      const $element = $(element);
      const title =
        $element.find("h3").first().text().trim() ||
        $element.find(".view-header").first().text().trim();

      if (title && !seenTitles.has(title)) {
        seenTitles.add(title);

        const items: HomeScraperItemType[] = [];

        $element
          .find(".swiper-row")
          .each((slideIndex: number, slideElement: any) => {
            const $slide = $(slideElement);

            const itemTitle =
              $slide
                .find(
                  `.${
                    type === "miks"
                      ? "views-field-title"
                      : "views-field-title-1"
                  } a`
                )
                .first()
                .text()
                .trim() || "";
            const link =
              $slide.find(".field-content a").first().attr("href") || "";
            const image = $slide.find("img").first().attr("src") || "";

            // Only add items with valid titles
            if (itemTitle) {
              items.push({
                id: `item-${index}-${slideIndex}-${Date.now()}`,
                title: itemTitle,
                link: link.startsWith("http") ? link : `https://kvf.fo${link}`,
                image: image.startsWith("http")
                  ? image
                  : `https://kvf.fo${image}`,
              });
            }
          });

        if (items.length > 0) {
          scrapedData.push({
            id: `section-${index}-${Date.now()}`,
            title,
            items,
          });
        }
      }
    }
  );

  return scrapedData;
};

export function useGetHomeScraper(
  type: HomeScraperType
): UseGetHomeScraperReturnProps {
  // Memoize URL to prevent unnecessary re-renders
  const url = useMemo(() => URL_MAP[type], [type]);

  const [data, setData] = useState<HomeScraperDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Use refs to prevent stale closures and track abort controller
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Prevent multiple simultaneous requests
      if (loading && !forceRefresh) {
        return;
      }

      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const html = await fetchWithProxy(url);

        // Check if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        const scrapedData = parseHtmlContent(html, type);

        if (!isMountedRef.current) {
          return;
        }

        setData(scrapedData);
        setLastFetchTime(Date.now());
      } catch (err) {
        if (!isMountedRef.current) {
          return;
        }

        // Don't set error if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Scraping error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while scraping"
        );
        setData(null);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [url, loading]
  );

  // Auto-refetch on mount and when URL changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Calculate if data is stale (older than 5 minutes)
  const isStale = useMemo(() => {
    return Date.now() - lastFetchTime > 5 * 60 * 1000; // 5 minutes
  }, [lastFetchTime]);

  return { data, loading, error, refetch, isStale };
}
