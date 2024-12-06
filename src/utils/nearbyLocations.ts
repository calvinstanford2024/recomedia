import { GOOGLE_API_KEY, PIXABAY_API_KEY } from "@env";

interface GooglePlacesResponse {
  places: Array<{
    displayName: {
      text: string;
    };
  }>;
}

interface PixabayResponse {
  hits: Array<{
    webformatURL: string;
  }>;
}

export interface NearbyLocation {
  locationName: string;
  imageUrl: string;
}

export async function getNearbyLocations(
  latitude: number,
  longitude: number
): Promise<NearbyLocation[]> {
  try {
    // Step 1: Call Google Places API
    const googlePlacesUrl =
      "https://places.googleapis.com/v1/places:searchNearby";
    const googlePayload = {
      includedTypes: [
        "cultural_landmark",
        "historical_place",
        "monument",
        "beach",
        "stadium",
        "museum",
        "park",
        "locality",
      ],
      maxResultCount: 5,
      locationRestriction: {
        circle: {
          center: { latitude, longitude },
          radius: 1000.0,
        },
      },
    };

    const googleResponse = await fetch(googlePlacesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.displayName",
      },
      body: JSON.stringify(googlePayload),
    });

    if (!googleResponse.ok) {
      throw new Error("Failed to fetch from Google Places API");
    }

    const googleData: GooglePlacesResponse = await googleResponse.json();
    const places = googleData.places || [];

    // Step 2: For each place, call Pixabay API
    const nearbyPlaces: NearbyLocation[] = [];

    for (const place of places) {
      const placeName = place.displayName?.text;
      if (!placeName) continue;

      const pixabayUrl = new URL("https://pixabay.com/api/");
      pixabayUrl.searchParams.append("key", PIXABAY_API_KEY);
      pixabayUrl.searchParams.append("q", placeName);
      pixabayUrl.searchParams.append("image_type", "photo");
      pixabayUrl.searchParams.append("orientation", "horizontal");
      pixabayUrl.searchParams.append("per_page", "3");

      const pixabayResponse = await fetch(pixabayUrl);
      if (!pixabayResponse.ok) {
        continue;
      }

      const pixabayData: PixabayResponse = await pixabayResponse.json();
      const imageUrl = pixabayData.hits[0]?.webformatURL || "";

      nearbyPlaces.push({
        locationName: placeName,
        imageUrl,
      });
    }

    return nearbyPlaces;
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    throw error;
  }
}
