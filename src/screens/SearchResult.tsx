import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
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

export const SearchResultPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "SearchResult">>();
  const [activeTab, setActiveTab] = useState<string>("All");
  const results = route.params.searchResults;

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

          <FilterTabs
            tabs={["All", "Movies", "Series"]}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />

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
