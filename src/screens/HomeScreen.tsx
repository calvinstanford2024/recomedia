// screens/HomeScreen.tsx
import React from "react";

import { StyleSheet, View, Image, Dimensions } from "react-native";

import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "../components/SearchBar";
import { BottomNav } from "../components/BottomNav";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSearch = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) return;
    navigation.navigate("SearchResult", { searchTerm });
  };

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
  subHeaderContainer: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
  },
});
