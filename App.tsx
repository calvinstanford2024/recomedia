import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { SearchResultPage } from "./src/screens/SearchResult";
import { RecommendationDetail } from "./src/screens/RecommendationDetail";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import type { SearchResponse } from "./src/types/api";

// Define the types for our navigation
export type RootStackParamList = {
  ExploreStack: undefined;
  HomeStack: undefined;
  CalendarStack: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
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

export type ExploreStackParamList = {
  Explore: undefined;
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

const Tab = createBottomTabNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const CalendarStack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "#1E1B2E" },
    }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <HomeStack.Screen name="SearchResult" component={SearchResultPage} />
    <HomeStack.Screen
      name="RecommendationDetail"
      component={RecommendationDetail}
    />
  </HomeStack.Navigator>
);

const ExploreStackScreen = () => (
  <ExploreStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "#1E1B2E" },
    }}
  >
    <ExploreStack.Screen name="Explore" component={ExploreScreen} />
    <ExploreStack.Screen name="SearchResult" component={SearchResultPage} />
    <ExploreStack.Screen
      name="RecommendationDetail"
      component={RecommendationDetail}
    />
  </ExploreStack.Navigator>
);

const CalendarStackScreen = () => (
  <CalendarStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "#1E1B2E" },
    }}
  >
    <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
  </CalendarStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeStack"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            if (route.name === "HomeStack") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "ExploreStack") {
              iconName = focused ? "compass" : "compass-outline";
            } else if (route.name === "CalendarStack") {
              iconName = focused ? "calendar" : "calendar-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: "#1a1a1a",
            borderTopWidth: 0,
            paddingTop: 10,
            height: 65,
          },
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#ffffff80",
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="ExploreStack" component={ExploreStackScreen} />
        <Tab.Screen name="HomeStack" component={HomeStackScreen} />
        <Tab.Screen name="CalendarStack" component={CalendarStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
