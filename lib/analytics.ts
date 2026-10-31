/** Optional analytics bridge. Never wait for analytics before following a link. */
export function trackEvent(
  event: string,
  details: Record<string, string> = {},
) {
  try {
    const url = new URL(window.location.href);
    const attribution: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const value = url.searchParams.get(key);
      if (value) attribution[key] = value.slice(0, 100);
    }
    const payload = {
      event,
      page_path: window.location.pathname,
      ...attribution,
      ...details,
    };
    const analytics = window as Window & {
      dataLayer?: Record<string, string>[];
    };
    // A configured GTM container can consume these events. No new tracker is loaded.
    analytics.dataLayer?.push(payload);
    window.dispatchEvent(new CustomEvent("nwo:analytics", { detail: payload }));
  } catch {
    // A blocked tracker, storage or browser extension must never break navigation.
  }
}
