/**
 * Fetches the title of a website from its URL
 * @param url - The website URL
 * @returns The page title or the domain name as fallback
 */
export async function fetchWebsiteTitle(url: string): Promise<string> {
  try {
    // Use a CORS proxy for client-side fetching or handle server-side
    const response = await fetch(url);
    const html = await response.text();

    // Extract title from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }

    // Fallback to domain name
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch (error) {
    // If fetch fails, extract domain name from URL
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch {
      return url;
    }
  }
}

/**
 * Extracts a clean domain name from a URL to use as title
 * @param url - The website URL
 * @returns Clean domain name
 */
export function getDomainAsTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");

    // Convert domain to title case (e.g., "techhub.dz" -> "Techhub.dz")
    return domain
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(".");
  } catch {
    return url;
  }
}
