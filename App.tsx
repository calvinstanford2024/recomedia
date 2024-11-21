import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { LocationDetailsScreen } from "./src/screens/LocationDetailsScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { FlightDetailsScreen } from "./src/screens/FlightDetailsScreen";
import { LocationScreen } from "./src/screens/LocationScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen
          name="LocationDetails"
          component={LocationDetailsScreen}
        />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
        {/* <Stack.Screen name="LocationScreen" component={LocationScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
