import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
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
      {/* commenting out profile icon for now until we get it implemented */}
      {/* <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="person-circle-outline" size={30} color="#ffffff80" />
      </TouchableOpacity> */}
      <View style={styles.content}>
        <SearchBar />
        {/* <Logo /> */}
        <Image
          source={require("../../assets/magic-button.png")}
          style={styles.icon}
        />
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  profileButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  icon: {
    width: screenWidth * 0.5, // Takes up about 50% of the screen width, or you can use 0.25 of screen height for balance
    height: screenHeight * 0.25, // Takes up about 25% of the screen height
    resizeMode: "contain",
    marginTop: 20,
  },
});
