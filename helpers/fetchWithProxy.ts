// Multiple proxy services for redundancy
const PROXY_SERVICES = [
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://thingproxy.freeboard.io/fetch/",
  "https://api.codetabs.com/v1/proxy?quest=",
];

const TIMEOUT_MS = 10000; // 10 seconds timeout
const MAX_RETRIES = 3;

// Cache for successful responses (simple in-memory cache)
const cache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

async function tryProxyService(
  proxyUrl: string,
  targetUrl: string
): Promise<string> {
  const fullUrl = proxyUrl + encodeURIComponent(targetUrl);

  try {
    const response = await Promise.race([
      fetch(fullUrl),
      createTimeoutPromise(TIMEOUT_MS),
    ]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Basic validation - ensure we got actual HTML content
    if (!html || html.length < 100) {
      throw new Error("Invalid or empty response");
    }

    console.log(`Success with proxy ${proxyUrl}, HTML length: ${html.length}`);
    return html;
  } catch (error) {
    console.warn(`Proxy ${proxyUrl} failed:`, error);
    throw error;
  }
}

export async function fetchWithProxy(url: string): Promise<string> {
  // Check cache first
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Returning cached response");
    return cached.data;
  }

  let lastError: Error | null = null;

  // Try each proxy service with retries
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    for (const proxyUrl of PROXY_SERVICES) {
      try {
        const html = await tryProxyService(proxyUrl, url);

        // Cache successful response
        cache.set(cacheKey, { data: html, timestamp: Date.now() });

        return html;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `Attempt ${attempt + 1} failed with proxy ${proxyUrl}:`,
          lastError.message
        );

        // Small delay before next attempt
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  // If all proxies failed, try direct fetch as last resort
  try {
    console.log("Trying direct fetch as fallback...");
    const response = await Promise.race([
      fetch(url),
      createTimeoutPromise(TIMEOUT_MS),
    ]);

    if (response.ok) {
      const html = await response.text();
      console.log("Direct fetch succeeded");

      // Cache successful response
      cache.set(cacheKey, { data: html, timestamp: Date.now() });

      return html;
    }
  } catch (directError) {
    console.warn("Direct fetch also failed:", directError);
  }

  // Clear cache entry if it exists but is stale
  cache.delete(cacheKey);

  throw new Error(
    `All proxy services failed after ${MAX_RETRIES} attempts. Last error: ${
      lastError?.message || "Unknown error"
    }`
  );
}

// Utility function to clear cache if needed
export function clearCache(): void {
  cache.clear();
  console.log("Proxy cache cleared");
}

// Utility function to get cache stats
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}
