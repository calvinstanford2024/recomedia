import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  Animated,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ItineraryItem } from "../components/ItineraryItem";
import * as Calendar from "expo-calendar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "../lib/supabase";
import type { SearchResponse } from "../types/api";

type CalendarStackParamList = {
  Calendar: undefined;
  SearchResult: {
    searchTerm: string;
    searchResults: SearchResponse;
  };
};

type NavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  "Calendar"
>;

interface CalendarEvent {
  title: string;
  startDate: Date;
  icon?: keyof typeof Ionicons.glyphMap;
}

const loadingMessages = [
  "Finding the perfect matches...",
  "Analyzing your preferences...",
  "Curating personalized recommendations...",
  "Almost there...",
];

export const CalendarScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const spinValue = new Animated.Value(0);

  const fetchCalendarEvents = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendars = calendars.filter(
        (cal) => cal.allowsModifications
      );

      if (defaultCalendars.length > 0) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Get events for next 7 days

        const eventsList = await Calendar.getEventsAsync(
          defaultCalendars.map((cal) => cal.id),
          startDate,
          endDate
        );

        const formattedEvents = eventsList.map((event) => ({
          title: event.title,
          startDate: new Date(event.startDate),
          icon: getIconForEvent(event.title),
        }));

        setEvents(formattedEvents);
      }
    } else {
      Alert.alert(
        "Permission Required",
        "Please allow calendar access to view your events",
        [{ text: "OK" }]
      );
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCalendarEvents();
    setRefreshing(false);
  }, []);

  const startSpinAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinValue]);

  useEffect(() => {
    if (isSearching) {
      const messageInterval = setInterval(() => {
        setLoadingMessageIndex((prev) =>
          prev === loadingMessages.length - 1 ? 0 : prev + 1
        );
      }, 3000);

      startSpinAnimation();

      return () => clearInterval(messageInterval);
    }
  }, [isSearching, startSpinAnimation]);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const handleEventPress = async (event: CalendarEvent) => {
    if (isSearching) return;
    setIsSearching(true);

    const searchTerm = event.title;
    setCurrentSearchTerm(searchTerm);

    try {
      const normalizedTerm = searchTerm.toLowerCase().trim();

      // Check Supabase first
      const { data: existingSearch, error: searchError } = await supabase
        .from("searches")
        .select("searchResult")
        .eq("searchTerm", normalizedTerm)
        .order("createdAt", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!searchError && existingSearch) {
        const result = JSON.parse(existingSearch.searchResult);
        const parsedResult = {
          ...result,
          Recommendations: JSON.parse(result.Recommendations[0]),
          AdditionalRecommendations: JSON.parse(
            result.AdditionalRecommendations[0]
          ),
        };

        navigation.navigate("SearchResult", {
          searchTerm,
          searchResults: parsedResult,
        });
        setIsSearching(false);
        return;
      }

      // Make API call if not in DB
      const response = await fetch(
        "https://hook.us2.make.com/tskvqrcq0xldr2p2m9n72qattbvu8chg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ term: searchTerm }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const rawData = await response.json();
      const parsedData: SearchResponse = {
        bannerUrl: rawData.bannerUrl,
        Recommendations: Array.isArray(rawData.Recommendations)
          ? JSON.parse(rawData.Recommendations[0])
          : rawData.Recommendations,
        AdditionalRecommendations: Array.isArray(
          rawData.AdditionalRecommendations
        )
          ? JSON.parse(rawData.AdditionalRecommendations[0])
          : rawData.AdditionalRecommendations,
      };

      navigation.navigate("SearchResult", {
        searchTerm,
        searchResults: parsedData,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getIconForEvent = (title: string): keyof typeof Ionicons.glyphMap => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes("flight")) return "airplane";
    if (lowercaseTitle.includes("meeting")) return "business";
    if (lowercaseTitle.includes("lunch") || lowercaseTitle.includes("dinner"))
      return "restaurant";
    if (lowercaseTitle.includes("coffee")) return "cafe";
    if (lowercaseTitle.includes("gym") || lowercaseTitle.includes("workout"))
      return "fitness";
    return "calendar";
  };

  const groupEventsByDay = (events: CalendarEvent[]) => {
    const groups: { [key: string]: CalendarEvent[] } = {};

    events.forEach((event) => {
      const date = event.startDate;
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dateKey = "";
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        dateKey = "Tomorrow";
      } else {
        dateKey = date.toLocaleDateString("en-US", { weekday: "long" });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const groupedEvents = groupEventsByDay(events);

  if (isSearching) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <Animated.View
            style={[styles.loadingIcon, { transform: [{ rotate: spin }] }]}
          >
            <Ionicons name="film-outline" size={50} color="#ffffff" />
          </Animated.View>
          <Text style={styles.loadingText}>
            {loadingMessages[loadingMessageIndex]}
          </Text>
          <Text style={styles.loadingSubtext}>
            Discovering content for "{currentSearchTerm}"
          </Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsSearching(false);
              navigation.navigate("Calendar");
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            titleColor="#ffffff"
          />
        }
      >
        <Text style={styles.title}>Calendar</Text>

        {Object.entries(groupedEvents).map(([day, dayEvents]) => (
          <View key={day} style={styles.section}>
            <Text style={styles.sectionTitle}>{day}:</Text>
            {dayEvents.map((event, index) => (
              <ItineraryItem
                key={index}
                icon={event.icon || "calendar"}
                title={event.title}
                onPress={() => handleEventPress(event)}
              />
            ))}
          </View>
        ))}

        {events.length === 0 && (
          <Text style={styles.noEvents}>No upcoming events</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 50,
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  noEvents: {
    color: "#ffffff80",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1E1B2E",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    padding: 20,
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  loadingSubtext: {
    color: "#ffffff80",
    fontSize: 14,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#6C5DD3",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
