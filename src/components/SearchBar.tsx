// SearchBar.tsx
import React, { useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (): void => {
    onSearch(searchTerm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <EvilIcons name="search" size={24} color="white" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for a location or event"
          placeholderTextColor="#ffffff80"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm("")}
            style={styles.clearButton}
          >
            <EvilIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        )}
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
  },
  clearButton: {
    padding: 10,
  },
});
