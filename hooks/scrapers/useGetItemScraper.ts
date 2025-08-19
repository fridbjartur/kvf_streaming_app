import { fetchWithProxy } from "@/helpers/fetchWithProxy";
import { useState, useEffect, useCallback } from "react";
// @ts-ignore - react-native-cheerio doesn't have proper TypeScript declarations
import * as cheerio from "react-native-cheerio";

interface ScrapedData {
  title: string;
  published: string;
  summary: string;
  thumbnail: string;
  m3u8Url: string;
}

interface UseWebScraperReturn {
  data: ScrapedData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetItemScraper(url: string): UseWebScraperReturn {
  const [data, setData] = useState<ScrapedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const html = await fetchWithProxy(url);
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
          return false;
        }
      });

      const m3u8Url = media
        ? `https://w-vod-edge1.kringvarp.fo/video/_definst_/smil:smil/video/${media}.smil/playlist.m3u8`
        : "";

      setData({ title, published, summary, thumbnail, m3u8Url });
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
