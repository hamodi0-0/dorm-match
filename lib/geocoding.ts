interface GeoCoords {
  lat: number;
  lng: number;
}

/**
 * Geocodes an address string to lat/lng using Nominatim (OpenStreetMap).
 * Free, no API key required.
 *
 * Returns null on failure — callers should silently swallow null and
 * save the listing without coordinates rather than blocking submission.
 */
export async function geocodeAddress(
  address: string,
): Promise<GeoCoords | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", address);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      headers: {
        // Nominatim requires a descriptive User-Agent
        "User-Agent": "Dormr/1.0 (roommate-finder-app)",
      },
    });

    if (!res.ok) return null;

    const results: Array<{ lat: string; lon: string }> = await res.json();

    if (!results.length) return null;

    return {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
    };
  } catch {
    // Network errors, parse errors — all treated as soft failures
    return null;
  }
}
