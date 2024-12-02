import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { supabase } from "../lib/supabase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ExploreStackParamList } from "../../App";
import type { SearchResponse } from "../types/api";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<
  ExploreStackParamList,
  "Explore"
>;

type NearbyLocation = {
  imageUrl: string;
  locationName: string;
};

type LocationResponse = {
  nearby: NearbyLocation[];
};

type SeasonalEvent = {
  imageUrl: string;
  locationName: string;
};

type StoredLocation = {
  latitude: number;
  longitude: number;
};

// Keep these refs outside the component to persist across remounts
const nearbyLocationsRef = {
  current: [] as NearbyLocation[],
};

const lastLocationRef = {
  current: null as StoredLocation | null,
};

const loadingMessages = [
  "Finding the perfect matches...",
  "Analyzing your preferences...",
  "Curating personalized recommendations...",
  "Almost there...",
];

export const ExploreScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>(
    nearbyLocationsRef.current
  );
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const spinValue = new Animated.Value(0);

  const startSpinAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinValue]);

  useEffect(() => {
    if (isSearching) {
      const messageInterval = setInterval(() => {
        setLoadingMessageIndex((prev) =>
          prev === loadingMessages.length - 1 ? 0 : prev + 1
        );
      }, 3000);

      startSpinAnimation();

      return () => clearInterval(messageInterval);
    }
  }, [isSearching, startSpinAnimation]);

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
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (lastLocationRef.current) {
        const distance = calculateDistance(
          lastLocationRef.current.latitude,
          lastLocationRef.current.longitude,
          location.coords.latitude,
          location.coords.longitude
        );

        if (distance < 1 && nearbyLocationsRef.current.length > 0) {
          setNearbyLocations(nearbyLocationsRef.current);
          return;
        }
      }

      lastLocationRef.current = {
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
        const data: LocationResponse = await response.json();
        nearbyLocationsRef.current = data.nearby;
        setNearbyLocations(data.nearby);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSeasonalEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("seasonalEvents")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setSeasonalEvents(data.events || []);
        }
      } catch (error) {
        console.error("Error fetching seasonal events:", error);
      }
    };

    fetchSeasonalEvents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (nearbyLocationsRef.current.length > 0) {
        setNearbyLocations(nearbyLocationsRef.current);
      }
      fetchNearbyLocations();
    }, [])
  );

  const handleLocationPress = async (
    location: NearbyLocation | SeasonalEvent
  ) => {
    if (isSearching) return;
    setIsSearching(true);

    const searchTerm = location.locationName;
    setCurrentSearchTerm(searchTerm);

    try {
      const normalizedTerm = searchTerm.toLowerCase().trim();

      // Check Supabase first
      const { data: existingSearch, error } = await supabase
        .from("searches")
        .select("searchResult")
        .eq("searchTerm", normalizedTerm)
        .single();

      if (!error && existingSearch) {
        const result = JSON.parse(existingSearch.searchResult);
        const parsedResult = {
          ...result,
          Recommendations: JSON.parse(result.Recommendations[0]),
          AdditionalRecommendations: JSON.parse(
            result.AdditionalRecommendations[0]
          ),
        };

        navigation.navigate("SearchResult", {
          searchTerm, // Use original searchTerm for display
          searchResults: parsedResult,
        });
        setIsSearching(false);
        return;
      }

      // Make API call if not in DB
      const response = await fetch(
        "https://hook.us2.make.com/tskvqrcq0xldr2p2m9n72qattbvu8chg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ term: searchTerm }), // Use original searchTerm for API
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const rawData = await response.json();
      const parsedData: SearchResponse = {
        bannerUrl: rawData.bannerUrl,
        Recommendations: Array.isArray(rawData.Recommendations)
          ? JSON.parse(rawData.Recommendations[0])
          : rawData.Recommendations,
        AdditionalRecommendations: Array.isArray(
          rawData.AdditionalRecommendations
        )
          ? JSON.parse(rawData.AdditionalRecommendations[0])
          : rawData.AdditionalRecommendations,
      };

      // Store in Supabase with normalized term
      const { error: insertError } = await supabase.from("searches").insert({
        searchTerm: normalizedTerm, // Use normalized term for storage
        searchResult: JSON.stringify({
          bannerUrl: parsedData.bannerUrl,
          Recommendations: [JSON.stringify(parsedData.Recommendations)],
          AdditionalRecommendations: [
            JSON.stringify(parsedData.AdditionalRecommendations),
          ],
        }),
      });

      if (insertError) throw insertError;

      navigation.navigate("SearchResult", {
        searchTerm, // Use original searchTerm for display
        searchResults: parsedData,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isSearching) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <Animated.View
            style={[styles.loadingIcon, { transform: [{ rotate: spin }] }]}
          >
            <Ionicons name="film-outline" size={50} color="#ffffff" />
          </Animated.View>
          <Text style={styles.loadingText}>
            {loadingMessages[loadingMessageIndex]}
          </Text>
          <Text style={styles.loadingSubtext}>
            Discovering content for "{currentSearchTerm}"
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Explore</Text>

        {nearbyLocations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Nearby Locations</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {nearbyLocations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => handleLocationPress(location)}
                >
                  <Image
                    source={{ uri: location.imageUrl }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardTitle}>
                      {location.locationName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {seasonalEvents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Seasonal Picks</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {seasonalEvents.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => handleLocationPress(event)}
                >
                  <Image
                    source={{ uri: event.imageUrl }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardTitle}>{event.locationName}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  mainScroll: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
    marginTop: 10,
  },
  scrollView: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    marginLeft: 20,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#2A2640",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1E1B2E",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    padding: 20,
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  loadingSubtext: {
    color: "#ffffff80",
    fontSize: 14,
    textAlign: "center",
  },
});
