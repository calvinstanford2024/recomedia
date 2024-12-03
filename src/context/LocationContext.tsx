import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

type NearbyLocation = {
  imageUrl: string;
  locationName: string;
};

type LocationContextType = {
  nearbyLocations: NearbyLocation[];
  isLoading: boolean;
  error: string | null;
  refreshLocations: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

type StoredLocation = {
  latitude: number;
  longitude: number;
};

let lastLocation: StoredLocation | null = null;
let cachedLocations: NearbyLocation[] = [];

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyLocations = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission not granted");
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (lastLocation) {
        const distance = calculateDistance(
          lastLocation.latitude,
          lastLocation.longitude,
          location.coords.latitude,
          location.coords.longitude
        );

        if (distance < 1 && cachedLocations.length > 0) {
          setNearbyLocations(cachedLocations);
          setIsLoading(false);
          return;
        }
      }

      lastLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const response = await fetch(
        "https://hook.us2.make.com/k83w33j0hl24vkwnch0ylgkh7rolze7o",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        cachedLocations = data.nearby;
        setNearbyLocations(data.nearby);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch nearby locations"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyLocations();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        nearbyLocations,
        isLoading,
        error,
        refreshLocations: fetchNearbyLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
