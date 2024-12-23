import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MediaCardProps {
  title: string;
  creator?: string;
  year?: string;
  rating?: number;
  image: any;
  description?: string;
  platforms?: string[];
  type: "movie" | "series";
}

export const MediaCard = ({
  title,
  creator,
  year,
  rating,
  image,
  description,
  platforms = [],
  type,
}: MediaCardProps) => {
  const renderPlatformIcon = (platform: string) => {
    const iconSize = 20;
    const iconColor = "#fff";

    switch (platform) {
      case "netflix":
        return <Ionicons name="play-circle" size={iconSize} color="#E50914" />;
      case "hulu":
        return <Ionicons name="play-circle" size={iconSize} color="#1CE783" />;
      case "prime":
        return <Ionicons name="play-circle" size={iconSize} color="#00A8E1" />;
      case "apple":
        return <Ionicons name="logo-apple" size={iconSize} color={iconColor} />;
      case "spotify":
        return (
          <Ionicons name="musical-notes" size={iconSize} color="#1DB954" />
        );
      case "apple-music":
        return (
          <Ionicons name="musical-notes" size={iconSize} color="#FC3C44" />
        );
      default:
        return (
          <Ionicons name="play-circle" size={iconSize} color={iconColor} />
        );
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.typeContainer}>
              <Text style={styles.type}>{type}</Text>
            </View>
          </View>
          {rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#8A2BE2" />
              <Text style={styles.rating}>{rating}%</Text>
            </View>
          )}
        </View>
        {(creator || year) && (
          <Text style={styles.creator}>
            {creator && creator}
            {year && (creator ? ` • ${year}` : year)}
          </Text>
        )}
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        {platforms.length > 0 && (
          <View style={styles.platforms}>
            {platforms.map((platform, index) => (
              <View key={index} style={styles.platformIcon}>
                {renderPlatformIcon(platform)}
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff10",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 150,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  typeContainer: {
    backgroundColor: "#ffffff20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  type: {
    color: "#ffffff80",
    fontSize: 12,
    textTransform: "capitalize",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#8A2BE2",
    marginLeft: 5,
    fontWeight: "bold",
  },
  creator: {
    color: "#ffffff80",
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    color: "#ffffff80",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  platforms: {
    flexDirection: "row",
    marginTop: "auto",
  },
  platformIcon: {
    marginRight: 10,
  },
});
