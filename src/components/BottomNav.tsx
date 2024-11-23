import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export const BottomNav = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");

  const handlePress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  useFocusEffect(
    useCallback(() => {
      const routeName =
        navigation.getState().routes[navigation.getState().index]?.name;
      if (routeName) {
        setActiveTab(routeName);
      }
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("ExploreScreen")}
      >
        <Ionicons
          name="compass"
          size={24}
          color={activeTab === "ExploreScreen" ? "#ffffff" : "#ffffff80"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("HomeScreen")}
      >
        <Ionicons
          name="home"
          size={24}
          color={activeTab === "HomeScreen" ? "#ffffff" : "#ffffff80"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("CalendarScreen")}
      >
        <Ionicons
          name="calendar"
          size={24}
          color={activeTab === "CalendarScreen" ? "#ffffff" : "#ffffff80"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#1a1a1a",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    backgroundColor: "#333333",
    borderRadius: 10,
  },
});
