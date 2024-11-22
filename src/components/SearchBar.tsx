import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  onSearch: (term: string) => Promise<void>;
  isLoading?: boolean;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async () => {
    if (!searchTerm.trim()) return;
    await onSearch(searchTerm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#ffffff80"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search for a location or event"
          placeholderTextColor="#ffffff80"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#ffffff80" />
          </TouchableOpacity>
        )}
        {isLoading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            color="#ffffff"
            size="small"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff15",
    borderRadius: 25,

    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
    height: "100%",

  },
  clearButton: {
    marginLeft: 10,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});
