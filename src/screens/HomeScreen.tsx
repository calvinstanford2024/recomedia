import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Text,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../App";
import type { SearchResponse } from "../types/api";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Home">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const loadingMessages = [
  "Finding the perfect matches...",
  "Analyzing your preferences...",
  "Curating personalized recommendations...",
  "Almost there...",
];

interface UserData {
  firstName: string;
  lastName: string;
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth(); // Get user information from AuthContext
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("firstName, lastName")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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
      const normalizedTerm = searchTerm.trim().toLowerCase();

      const { data: existingSearch, error: searchError } = await supabase
        .from("searches")
        .select("searchResult")
        .eq("searchTerm", normalizedTerm)
        .order("createdAt", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (searchError) {
        console.error("Error checking for existing search:", searchError);
        throw searchError;
      }

      if (existingSearch) {
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
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsLoading(false);
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            source={require("../../assets/logo-final.png")}
            style={styles.icon}
          />
          {userData && (
            <Text style={styles.greetingText}>
              Hello, {userData.firstName}!
            </Text>
          )}
          <View style={styles.searchBar}>
            <SearchBar onSearch={handleSearch} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    width: screenWidth * 0.35,
    height: screenHeight * 0.35,
    resizeMode: "contain",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: -50,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
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
    marginTop: 10,
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
  searchBar: {
    width: screenWidth * 0.95,
    marginTop: -20,
  },
  cancelButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#6C5DD3",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
