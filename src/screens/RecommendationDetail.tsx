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
import type { RootStackParamList } from "../../App";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RecommendationDetail"
>;
type DetailRouteProp = RouteProp<RootStackParamList, "RecommendationDetail">;

const { width: screenWidth } = Dimensions.get("window");

export const RecommendationDetail: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();

  const {
    title = "",
    year = "",
    creator = "",
    description = "",
    reason = "",
    places_featured = [],
    where_to_watch = [],
    imageUrl = "",
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
        <View
          style={[styles.headerPlaceholder, { backgroundColor: "#2A2640" }]}
        />
      );
    }

    return (
      <View style={styles.headerPlaceholder}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeaderImage()}

      <SafeAreaView style={styles.safeArea}>
        {/* Header buttons container */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { marginLeft: 10 }]}>
              <Ionicons name="bookmark-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.metaContainer}>
            {year && <Text style={styles.metaText}>{year}</Text>}
            {year && creator && <Text style={styles.metaText}> • </Text>}
            {creator && <Text style={styles.metaText}>{creator}</Text>}
            {rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#6C5DD3" />
                <Text style={styles.ratingText}>{rating}%</Text>
              </View>
            )}
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
                {places_featured.map((place, index) => (
                  <View key={index} style={styles.placeCard}>
                    <View style={styles.placeholderImage}>
                      <Ionicons
                        name="image-outline"
                        size={24}
                        color="#ffffff40"
                      />
                    </View>
                    <Text style={styles.placeName}>{place}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {Array.isArray(where_to_watch) && where_to_watch.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Where to Watch</Text>
              <View style={styles.streamingContainer}>
                {where_to_watch.map((platform, index) => {
                  const color = streamingColors[platform] || "#666666";
                  const initial = platform.charAt(0).toUpperCase();
                  return (
                    <View
                      key={index}
                      style={[styles.streamingIcon, { backgroundColor: color }]}
                    >
                      <Text style={styles.streamingText}>{initial}</Text>
                    </View>
                  );
                })}
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
    height: "35%",
    position: "absolute",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(42, 38, 64, 0.7)",
  },
  // New styles for header buttons
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginTop: "55%", // Adjusted to account for header buttons
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#1E1B2E",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 16,
    color: "#ffffff80",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5DD320",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  ratingText: {
    color: "#6C5DD3",
    marginLeft: 4,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#ffffff80",
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    marginTop: 8,
  },
  reasonText: {
    fontSize: 16,
    color: "#ffffff80",
    lineHeight: 24,
    marginBottom: 24,
  },
  placesContainer: {
    paddingRight: 20,
  },
  placeCard: {
    width: screenWidth * 0.4,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  placeholderImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#ffffff10",
    justifyContent: "center",
    alignItems: "center",
  },
  placeName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  streamingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  streamingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  streamingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSpacer: {
    height: 40,
  },
});

export default RecommendationDetail;
