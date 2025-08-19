import { fetchWithProxy } from "@/helpers/fetchWithProxy";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// @ts-ignore - react-native-cheerio doesn't have proper TypeScript declarations
import * as cheerio from "react-native-cheerio";

type ScrapedEpisodeType = {
  id: string;
  title: string;
  link: string;
  image: string;
  description: string;
  published: string;
};
interface ScrapedData {
  title: string;
  published: string;
  summary: string;
  thumbnail: string;
  m3u8Url: string;
  episodes: ScrapedEpisodeType[];
}

interface UseWebScraperReturn {
  data: ScrapedData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isStale: boolean;
}

// Memoized parsing function to avoid recreating on every render
const parseHtmlContent = (html: string): ScrapedData => {
  const $ = cheerio.load(html);

  const title = $("#sending_uvtitle").first().text().trim() || "";
  const published = $("#sending_publish").first().text().trim() || "";
  const summary = $("#sending_uvsummary").first().text().trim() || "";
  const thumbnail = $("img.img-responsive").first().attr("src") || "";

  // Look through all <script> tags to find "var media = ..."
  let media = "";
  $("script").each((_: unknown, el: cheerio.Element) => {
    const scriptText = $(el).html() || "";
    const match = scriptText.match(/var\s+media\s*=\s*["']([^"']+)["']/);
    if (match && match[1]) {
      media = match[1];
      return false; // Break the loop once found
    }
  });

  const m3u8Url = media
    ? `https://w-vod-edge1.kringvarp.fo/video/_definst_/smil:smil/video/${media}.smil/playlist.m3u8`
    : "";

  const episodes: ScrapedEpisodeType[] = [];
  const seenEpisodePublished = new Set<string>([published, title]);

  $(".quicktabs-views-group").each((index: number, element: any) => {
    const $element = $(element);
    const episodeTitle =
      $element.find(".views-field-title a").first().text().trim() || "";
    const episodeLink = $element.find("a").first().attr("href") || "";
    const image = $element.find("img").first().attr("src") || "";
    const description =
      $element
        .find(".views-field-field-summary-article .field-content")
        .first()
        .text()
        .trim() || "";
    const episodePublished =
      $element.find(".date-display-single").first().text().trim() || "";

    if (
      episodeTitle &&
      episodeLink &&
      (!seenEpisodePublished.has(episodePublished) ||
        !seenEpisodePublished.has(episodeTitle))
    ) {
      seenEpisodePublished.add(episodePublished);
      seenEpisodePublished.add(episodeTitle);

      episodes.push({
        id: `episode-${index}-${Date.now()}`,
        title: episodeTitle,
        description,
        link: episodeLink.startsWith("http")
          ? episodeLink
          : `https://kvf.fo${episodeLink}`,
        image: image.startsWith("http") ? image : `https://kvf.fo${image}`,
        published: episodePublished,
      });
    }
  });

  return { title, published, summary, thumbnail, m3u8Url, episodes };
};

// Validation function for scraped data
const validateScrapedData = (data: ScrapedData): boolean => {
  return !!(data.title && (data.m3u8Url || data.thumbnail));
};

export function useGetItemScraper(url: string): UseWebScraperReturn {
  const [data, setData] = useState<ScrapedData | null>(null);
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

        const scrapedData = parseHtmlContent(html);

        // Validate the scraped data
        if (!validateScrapedData(scrapedData)) {
          throw new Error("Invalid or incomplete data received");
        }

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
    if (url) {
      fetchData();
    }
  }, [fetchData, url]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Calculate if data is stale (older than 5 minutes)
  const isStale = useMemo(() => {
    return Date.now() - lastFetchTime > 5 * 60 * 1000; // 5 minutes
  }, [lastFetchTime]);

  return { data, loading, error, refetch, isStale };
}
