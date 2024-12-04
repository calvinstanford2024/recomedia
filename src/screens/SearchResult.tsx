import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FilterTabs } from "../components/FilterTabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { SearchResponse, Recommendation } from "../types/api";
import type { RootStackParamList } from "../types/navigation";
import { SearchTerm, ImageUrl } from "../types/common";
import { supabase } from "../lib/supabase";
import logo from "../../assets/logo-final.png";

const { width: screenWidth } = Dimensions.get("window");
const WEBHOOK_URL =
  "https://hook.us2.make.com/1er9s9t0anvvjn91slg3cbqocjpaciae";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SearchResultRouteProp = RouteProp<RootStackParamList, "SearchResult">;

interface APIResponse {
  title: string;
  year: string;
  creator: string;
  description: string;
  reason: string;
  places_featured: string[];
  where_to_watch: string[];
}

export const SearchResultPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultRouteProp>();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<
    Record<string, boolean>
  >({});
  const [bannerError, setBannerError] = useState(false);

  const { searchTerm, searchResults } = route.params;

  const handleRecommendationClick = async (item: Recommendation) => {
    setIsLoading(true);
    try {
      // Check Supabase first for existing details
      const { data: existingDetail, error: fetchError } = await supabase
        .from("mediaDetail")
        .select("*")
        .eq("title", item.Title)
        .single();

      if (!fetchError && existingDetail) {
        // If found in database, use cached data
        const navigationParams = {
          title: existingDetail.title,
          year: existingDetail.year,
          creator: existingDetail.creator,
          description: existingDetail.description,
          reason: existingDetail.reason,
          places_featured: existingDetail.places_featured,
          where_to_watch: existingDetail.where_to_watch,
          imageUrl: item.imageUrl,
          rating: item.Rating,
        };

        navigation.navigate("RecommendationDetail", navigationParams);
        return;
      }

      // If not found in database, make API call
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.Title,
          imageUrl: item.imageUrl,
          searchTerm: searchTerm,
        }),
      });

      console.log("API Request sent for title:", item.Title);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw API Response:", text);
      let apiResponse: APIResponse;

      try {
        const cleanText = text.trim();
        console.log("Cleaned text:", cleanText);
        if (cleanText.startsWith("'") && cleanText.endsWith("'")) {
          const jsonText = cleanText.slice(1, -1).replace(/\\'/g, "'");
          console.log("Processed JSON text:", jsonText);
          apiResponse = JSON.parse(jsonText);
        } else {
          apiResponse = JSON.parse(cleanText);
        }

        console.log("Parsed API Response:", apiResponse);

        if (!apiResponse || typeof apiResponse !== "object") {
          throw new Error("Invalid API response format");
        }

        const navigationParams = {
          title: apiResponse.title,
          year: apiResponse.year,
          creator: apiResponse.creator,
          description: apiResponse.description,
          reason: apiResponse.reason,
          places_featured: apiResponse.places_featured,
          where_to_watch: apiResponse.where_to_watch,
          imageUrl: item.imageUrl,
          rating: item.Rating,
        };

        navigation.navigate("RecommendationDetail", navigationParams);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse API response");
      }
    } catch (error) {
      console.error("Error in handleRecommendationClick:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (imageUrl: string) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
  };

  const renderBanner = () => {
    if (!searchResults.bannerUrl || bannerError) {
      return <View style={styles.headerImage} />;
    }

    return (
      <Image
        source={{ uri: searchResults.bannerUrl }}
        style={styles.headerImage}
        onError={() => setBannerError(true)}
      />
    );
  };

  const renderPosterImage = (imageUrl: string) => {
    if (!imageUrl || imageLoadErrors[imageUrl]) {
      return (
        <View style={styles.placeholderPoster}>
          <Ionicons name="film-outline" size={40} color="#ffffff40" />
          <Text style={styles.placeholderText}>No Poster</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.posterImage}
        onError={() => handleImageError(imageUrl)}
      />
    );
  };

  const filteredRecommendations = searchResults.Recommendations.filter(
    (item) =>
      activeTab === "All" || item.Type.toLowerCase() === activeTab.toLowerCase()
  );

  const filteredAdditionalRecommendations =
    searchResults.AdditionalRecommendations.filter(
      (item) =>
        activeTab === "All" ||
        item.Type.toLowerCase() === activeTab.toLowerCase()
    );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderBanner()}

      <Modal transparent visible={isLoading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#6C5DD3" />
          </View>
        </View>
      </Modal>

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
          <Text style={styles.title}>Results for {searchTerm}</Text>

          <FilterTabs
            tabs={["All", "Movie", "Series"]}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />

          <View style={styles.mainRecommendationsContainer}>
            {filteredRecommendations.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mainCard}
                onPress={() => handleRecommendationClick(item)}
              >
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
                <View style={styles.ratingContainer}>
                  <Image source={logo} style={styles.ratingIcon} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredAdditionalRecommendations.length > 0 && (
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
                    onPress={() => handleRecommendationClick(item)}
                  >
                    <View style={styles.imageWrapper}>
                      {renderPosterImage(item.imageUrl)}
                    </View>
                    {/* <View style={styles.posterOverlay}> */}
                    <Text style={styles.posterTitle} numberOfLines={2}>
                      {item.Title}
                    </Text>
                    {/* <View style={styles.typeContainer}>
                        <Text style={styles.typeText}>{item.Type}</Text>
                      </View> */}
                    {/* </View> */}
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
    height: "35%",
    position: "absolute",
    backgroundColor: "#2A2640",
    resizeMode: "cover",
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
    width: 115,
    height: 185,
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mainCardContent: {
    flex: 1,
    padding: 12,
  },
  mainCardTitle: {
    color: "#fff",
    fontSize: 20,
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
  moreToExploreContainer: {
    paddingRight: 20,
  },
  posterContainer: {
    width: 140,
    //height: 250,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    //backgroundColor: "#ffffff10",
    alignItems: "center",
  },
  imageWrapper: {
    width: 140, // Match posterContainer width
    height: 210, // Fixed height for the image
    borderRadius: 12, // Optional: Rounded corners
    overflow: "hidden", // Ensure the image fits within the container
    backgroundColor: "#ffffff10", // Placeholder background
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
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#1E1B2E",
  },
  ratingContainer: {
    position: "absolute",
    bottom: 5,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    width: 35,
    height: 35,
    marginRight: -4,
  },
  ratingText: {
    color: "#D3B3FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
