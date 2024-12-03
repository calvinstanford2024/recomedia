import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";
import { LinearGradient } from "expo-linear-gradient";

export interface Recommendation {
  title: string;
  year: string;
  creator: string;
  description: string;
  reason: string;
  places_featured: string[];
  where_to_watch: string[];
  imageUrl: string;
  rating: number;
}

interface LocationInfo {
  imageUrl: string;
  locationName: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, "RecommendationDetail">;

const { width: screenWidth } = Dimensions.get("window");

export const RecommendationDetail: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();

  const {
    title,
    year,
    creator,
    description,
    reason,
    places_featured,
    where_to_watch,
    imageUrl,
    rating = 90,
  } = route.params;

  const streamingColors: { [key: string]: string } = {
    Netflix: "#E50914",
    Max: "#741DEB",
    "HBO Max": "#741DEB",
    Hulu: "#1CE783",
    "Prime Video": "#00A8E1",
    "Apple TV+": "#000000",
    "HBO Now": "#741DEB",
    "Amazon Prime Video": "#00A8E1",
    "Paramount+": "#0064FF",
    Disney: "#113CCF",
    "Disney+": "#113CCF",
    Peacock: "#000000",
  };

  const handleShare = async () => {
    try {
      const message = `Check out ${title}${creator ? ` by ${creator}` : ""}${
        year ? ` (${year})` : ""
      }`;
      await Share.share({
        message,
        title: title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderHeaderImage = () => {
    if (!imageUrl) {
      return (
        <View style={styles.headerPlaceholder}>
          <LinearGradient
            colors={["rgba(30, 27, 46, 0)", "rgba(30, 27, 46, 1)"]}
            style={styles.headerGradient}
          />
        </View>
      );
    }

    return (
      <View style={styles.headerPlaceholder}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(30, 27, 46, 0)", "rgba(30, 27, 46, 1)"]}
          style={styles.headerGradient}
        />
      </View>
    );
  };

  const parsedLocations = React.useMemo(() => {
    if (where_to_watch && where_to_watch[0]) {
      try {
        return JSON.parse(where_to_watch[0]) as LocationInfo[];
      } catch (e) {
        console.error("Failed to parse locations:", e);
        return [];
      }
    }
    return [];
  }, [where_to_watch]);

  return (
    <View style={styles.container}>
      {renderHeaderImage()}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {rating && (
              <View style={styles.ratingBadge}>
                {/* <Image
                  // source={require("../assets/rating-icon.png")}
                  source={require("../assets/fruitvale.jpg")}
                  style={styles.ratingIcon}
                /> */}
                <Text style={styles.ratingText}>{rating}%</Text>
              </View>
            )}
          </View>

          <View style={styles.metaContainer}>
            {year && <Text style={styles.metaText}>{year}</Text>}
            {creator && (
              <>
                <Text style={styles.metaDot}> • </Text>
                <Text style={styles.metaText}>{creator}</Text>
              </>
            )}
            <Text style={styles.metaDot}> • </Text>
            <Text style={styles.metaText}>Comedy/Drama</Text>
          </View>

          {description && <Text style={styles.description}>{description}</Text>}

          {reason && (
            <>
              <Text style={styles.sectionTitle}>Why this?</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </>
          )}

          {Array.isArray(places_featured) && places_featured.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Places featured:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.placesContainer}
              >
                {parsedLocations.map((location, index) => (
                  <View key={index} style={styles.placeCard}>
                    <Image
                      source={{ uri: location.imageUrl }}
                      style={styles.placeImage}
                    />
                    <Text style={styles.placeName}>
                      {location.locationName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {Array.isArray(where_to_watch) && where_to_watch.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Where to Watch</Text>
              <View style={styles.streamingContainer}>
                {where_to_watch.map((platform, index) => (
                  <Image
                    key={index}
                    source={{
                      uri: `https://logo.clearbit.com/${platform
                        .toLowerCase()
                        .replace(/\s+/g, "")}.com`,
                    }}
                    style={styles.streamingLogo}
                  />
                ))}
              </View>
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
  headerPlaceholder: {
    width: "100%",
    height: "45%",
    position: "absolute",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 1,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginTop: "35%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#1E1B2E",
    padding: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginRight: 16,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(108, 93, 211, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  ratingText: {
    color: "#6C5DD3",
    fontSize: 16,
    fontWeight: "600",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
  },
  metaDot: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  reasonText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    marginBottom: 32,
  },
  placesContainer: {
    paddingRight: 24,
  },
  placeCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff10",
  },
  placeImage: {
    width: "100%",
    height: 120,
    borderRadius: 16,
  },
  placeName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  streamingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  streamingLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  bottomSpacer: {
    height: 40,
  },
});

export default RecommendationDetail;
