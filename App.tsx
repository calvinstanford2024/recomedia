import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { SearchResultPage } from "./src/screens/SearchResult";
import { RecommendationDetail } from "./src/screens/RecommendationDetail";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import type { SearchResponse } from "./src/types/api";

export type RootStackParamList = {
  HomeScreen: undefined;
  ExploreScreen: undefined;
  CalendarScreen: undefined;
  SearchResult: {
    searchTerm: string;
    searchResults: SearchResponse;
  };
  RecommendationDetail: {
    title: string;
    year: string;
    creator: string;
    description: string;
    reason: string;
    places_featured: string[];
    where_to_watch: string[];
    imageUrl: string;
    rating?: number;
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
        <Stack.Screen
          name="RecommendationDetail"
          component={RecommendationDetail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
