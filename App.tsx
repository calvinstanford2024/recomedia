import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { SearchResultPage } from "./src/screens/SearchResult";
import { SearchResponse } from "./types/api";
import { CalendarScreen } from "./src/screens/CalendarScreen";

export type RootStackParamList = {
  Home: undefined;
  SearchResult: {
    searchTerm: string;
    searchResults: SearchResponse;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1E1B2E" },
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
