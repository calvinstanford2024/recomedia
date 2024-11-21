
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SearchResultPage } from "./src/screens/SearchResult";

export type RootStackParamList = {
  Home: undefined;
  SearchResult: { searchTerm: string };
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
