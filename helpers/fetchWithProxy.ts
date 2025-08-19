const PROXY_URL = "https://api.allorigins.win/raw?url=";

export async function fetchWithProxy(url: string): Promise<string> {
  try {
    const response = await fetch(PROXY_URL + encodeURIComponent(url));

    if (response.ok) {
      const html = await response.text();
      console.log(`Success with proxy, HTML length: ${html.length}`);
      return html;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    throw new Error("Failed to fetch data from proxy");
  }
}
