import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SearchBar } from "../components/SearchBar";
import { Logo } from "../components/Logo";
import { BottomNav } from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
//import { Image } from "react-native"

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Image
          source={require("../../assets/recomedia-slogan.png")}
          style={styles.icon}
        />
        <SearchBar />
      </View>
      <BottomNav />
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  profileButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
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
