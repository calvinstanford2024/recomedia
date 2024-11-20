import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FilterTabs } from "../components/FilterTabs";
import { MediaCard } from "../components/MediaCard";
//import { fetchMediaDataFromSupabase } from '../services/mediaService';

export const LocationScreen = ({ route }: { route: any }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("All");
  const [mediaItems, setMediaItems] = useState<
    Array<{
      title: string;
      creator: string;
      year: string;
      rating: number;
      image: string;
      description?: string;
      platforms: string[];
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const { location } = route.params;

  useEffect(() => {
    const getMediaData = async () => {
      try {
        //const data = await fetchMediaDataFromSupabase(location);
        //setMediaItems(data);
      } catch (error) {
        console.error("Error fetching media data:", error);
      } finally {
        setLoading(false);
      }
    };

    getMediaData();
  }, [location]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../../assets/la-mountains.jpg")} // You can make this dynamic as well based on location
        style={styles.headerImage}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>FLIGHT TO {location.toUpperCase()}</Text>

        <FilterTabs
          tabs={["All", "Movies", "TV", "Books", "Songs"]}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <FlatList
            data={mediaItems}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <MediaCard
                title={item.title}
                creator={item.creator}
                year={item.year}
                rating={item.rating}
                image={{ uri: item.image }}
                description={item.description}
                platforms={item.platforms}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  headerImage: {
    width: "100%",
    height: 200,
    position: "absolute",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
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
});
