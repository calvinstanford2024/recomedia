import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FilterTabs } from "../components/FilterTabs";
import type { SearchResponse } from "../../types/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../App";

const { width: screenWidth } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SearchResult"
>;

const loadingMessages = [
  "Scanning through movies and shows...",
  "Finding the perfect matches...",
  "Analyzing your preferences...",
  "Curating personalized recommendations...",
  "Almost there...",
];

export const SearchResultPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "SearchResult">>();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  // Cycle through loading messages
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

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(
        "https://hook.us2.make.com/nl0xba966wmxrd1cfd972yzn896jifnp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ term: route.params.searchTerm }),
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

      setResults(parsedData);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPosterImage = (imageUrl: string) => {
    if (!imageUrl || imageUrl === "N/A") {
      return (
        <View style={styles.placeholderPoster}>
          <Ionicons name="film-outline" size={40} color="#ffffff40" />
          <Text style={styles.placeholderText}>No Poster</Text>
        </View>
      );
    }
    return <Image source={{ uri: imageUrl }} style={styles.posterImage} />;
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
            Discovering content for "{route.params.searchTerm}"
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setError(null);
            fetchResults();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const filteredRecommendations = results?.Recommendations.filter(
    (item) =>
      activeTab === "All" || item.Type.toLowerCase() === activeTab.toLowerCase()
  );

  const filteredAdditionalRecommendations =
    results?.AdditionalRecommendations.filter(
      (item) =>
        activeTab === "All" ||
        item.Type.toLowerCase() === activeTab.toLowerCase()
    );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{ uri: results?.bannerUrl }}
        style={styles.headerImage}
        defaultSource={require("../../assets/magic-button.png")}
        onError={() => console.log("Error loading banner image")}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            Results for {route.params.searchTerm}
          </Text>
          {/* 
          <FilterTabs
            tabs={["All", "Movies", "Series"]}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          /> */}

          <View style={styles.mainRecommendationsContainer}>
            {filteredRecommendations?.map((item, index) => (
              <View key={index} style={styles.mainCard}>
                <View style={styles.mainPosterContainer}>
                  {renderPosterImage(item.imageUrl)}
                </View>
                <View style={styles.mainCardContent}>
                  <Text style={styles.mainCardTitle}>{item.Title}</Text>
                  <Text style={styles.mainCardSubtitle}>
                    {item.Creator} • {item.Year}
                  </Text>
                  <Text style={styles.mainCardDescription} numberOfLines={3}>
                    {item.Reason}
                  </Text>
                  <View style={styles.typeContainer}>
                    <Text style={styles.typeText}>{item.Type}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filteredAdditionalRecommendations &&
            filteredAdditionalRecommendations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>More to Explore</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moreToExploreContainer}
                >
                  {filteredAdditionalRecommendations.map((item, index) => (
                    <TouchableOpacity
                      key={`additional-${index}`}
                      style={styles.posterContainer}
                      activeOpacity={0.7}
                    >
                      {renderPosterImage(item.imageUrl)}
                      <View style={styles.posterOverlay}>
                        <Text style={styles.posterTitle} numberOfLines={2}>
                          {item.Title}
                        </Text>
                        <View style={styles.typeContainer}>
                          <Text style={styles.typeText}>{item.Type}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  safeArea: {
    flex: 1,
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
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1,
  },
  headerImage: {
    width: "100%",
    height: 250,
    position: "absolute",
    backgroundColor: "#2A2640",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        marginTop: 4,
      },
      android: {
        marginTop: 8,
      },
    }),
  },
  content: {
    flex: 1,
    marginTop: 150,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#1E1B2E",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  mainRecommendationsContainer: {
    marginTop: 10,
  },
  mainCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff10",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  mainPosterContainer: {
    width: 100,
    height: 150,
  },
  mainCardContent: {
    flex: 1,
    padding: 12,
  },
  mainCardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mainCardSubtitle: {
    color: "#ffffff80",
    fontSize: 14,
    marginBottom: 8,
  },
  mainCardDescription: {
    color: "#ffffff80",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
    marginBottom: 15,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#ffffff15",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
  },
  moreToExploreContainer: {
    paddingRight: 20,
  },
  posterContainer: {
    width: 140,
    height: 210,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff10",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderPoster: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff10",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#ffffff40",
    fontSize: 12,
    marginTop: 8,
  },
  posterOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  posterTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  typeContainer: {
    backgroundColor: "#ffffff20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  typeText: {
    color: "#ffffff80",
    fontSize: 10,
    textTransform: "capitalize",
  },
  bottomSpacer: {
    height: 20,
  },
});
