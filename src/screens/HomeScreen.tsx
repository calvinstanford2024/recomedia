import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Text,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "../components/SearchBar";
import { BottomNav } from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import type { SearchResponse } from "../../types/api";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const loadingMessages = [
  "Scanning through movies and shows...",
  "Finding the perfect matches...",
  "Analyzing your preferences...",
  "Curating personalized recommendations...",
  "Almost there...",
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(""); // Added this state
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const spinValue = new Animated.Value(0);

  // Rotate animation for loading icon
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

  React.useEffect(() => {
    if (isLoading) {
      const messageInterval = setInterval(() => {
        setLoadingMessageIndex((prev) =>
          prev === loadingMessages.length - 1 ? 0 : prev + 1
        );
      }, 3000);

      startSpinAnimation();

      return () => clearInterval(messageInterval);
    }
  }, [isLoading, startSpinAnimation]);

  const handleSearch = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) return;

    setCurrentSearchTerm(searchTerm); // Store the search term
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://hook.us2.make.com/nl0xba966wmxrd1cfd972yzn896jifnp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ term: searchTerm }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const rawData: {
        bannerUrl: string;
        Recommendations: string[];
        AdditionalRecommendations: string[];
      } = await response.json();

      const parsedData: SearchResponse = {
        bannerUrl: rawData.bannerUrl,
        Recommendations: JSON.parse(rawData.Recommendations[0]),
        AdditionalRecommendations: JSON.parse(
          rawData.AdditionalRecommendations[0]
        ),
      };

      navigation.navigate("SearchResult", {
        searchTerm,
        searchResults: parsedData,
      });
    } catch (err) {
      console.error("Search error:", err);
      // You might want to show an error toast or message here
    } finally {
      setIsLoading(false);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isLoading) {
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
      <View style={styles.content}>
        <Image
          source={require("../../assets/recomedia-slogan.png")}
          style={styles.icon}
        />
        <SearchBar onSearch={handleSearch} />
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  icon: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.5,
    resizeMode: "contain",
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
