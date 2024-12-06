import { GOOGLE_API_KEY } from "@env";

interface GooglePlacesResponse {
  places: Array<{
    displayName: {
      text: string;
    };
    photos: Array<{
      name: string;
    }>;
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
        "X-Goog-FieldMask": "places.displayName,places.photos",
      },
      body: JSON.stringify(googlePayload),
    });

    if (!googleResponse.ok) {
      throw new Error("Failed to fetch from Google Places API");
    }

    const googleData: GooglePlacesResponse = await googleResponse.json();
    const places = googleData.places || [];

    // Process each place and get its photo
    const nearbyPlaces: NearbyLocation[] = await Promise.all(
      places.map(async (place) => {
        const placeName = place.displayName?.text;
        if (!placeName) {
          return null;
        }

        let imageUrl = "";
        if (place.photos && place.photos.length > 0) {
          const photoReference = place.photos[0].name;
          imageUrl = `https://places.googleapis.com/v1/${photoReference}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400&maxWidthPx=400`;
        }

        return {
          locationName: placeName,
          imageUrl,
        };
      })
    );

    return nearbyPlaces.filter(
      (place): place is NearbyLocation => place !== null
    );
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    throw error;
  }
}
