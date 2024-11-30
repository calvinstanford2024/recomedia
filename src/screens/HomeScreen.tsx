import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "../components/SearchBar";
import { BottomNav } from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import type { SearchResponse } from "../types/api";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const loadingMessages = [
  "Finding the perfect matches...",
  "Analyzing your preferences...",
  "Curating personalized recommendations...",
  "Almost there...",
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
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

    setCurrentSearchTerm(searchTerm);
    setIsLoading(true);

    try {
      const normalizedTerm = searchTerm.toLowerCase();

      // Check Supabase
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
          searchTerm,
          searchResults: parsedResult,
        });
        setIsLoading(false);
        return;
      }

      // Make API call if not in DB
      const response = await fetch(
        "https://hook.us2.make.com/tskvqrcq0xldr2p2m9n72qattbvu8chg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ term: searchTerm }),
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

      // Store in Supabase
      const { error: insertError } = await supabase.from("searches").insert({
        searchTerm: normalizedTerm,
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
        searchTerm,
        searchResults: parsedData,
      });
    } catch (err) {
      console.error("Search error:", err);
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Ionicons name="person-circle-outline" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
