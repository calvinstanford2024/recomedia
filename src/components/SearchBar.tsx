import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export const SearchBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <EvilIcons name="search" size={24} color="white" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for a location"
          placeholderTextColor="#ffffff80"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff15",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
