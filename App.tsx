import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { SearchResultPage } from "./src/screens/SearchResult";
import { RecommendationDetail } from "./src/screens/RecommendationDetail";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import type { SearchResponse } from "./src/types/api";
import { linking } from "./src/lib/linking";

export type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  ExploreScreen: undefined;
  CalendarScreen: undefined;
  ProfileScreen: undefined;
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

function NavigationContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E1B2E",
        }}
      >
        <ActivityIndicator size="large" color="#6C5DD3" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1E1B2E" },
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="SearchResult" component={SearchResultPage} />
          <Stack.Screen
            name="RecommendationDetail"
            component={RecommendationDetail}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <NavigationContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
