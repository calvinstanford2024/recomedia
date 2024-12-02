import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface CalendarEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export const CalendarScreen = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Replace this with your actual Web Client ID from Google Cloud Console
  const CLIENT_ID =
    "193482427987-qj3cvbqaocjqa059i9kj4e3035m6foqj.apps.googleusercontent.com";

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: CLIENT_ID,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      const calendarData = await fetchCalendarData(tokens.accessToken);
      setEvents(calendarData.items || []);
      setIsSignedIn(true);
    } catch (error) {
      console.error("Error during sign-in: ", error);
    }
  };

  const fetchCalendarData = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching calendar data: ", error);
      return { items: [] };
    }
  };

  const renderItem = ({ item }: { item: CalendarEvent }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.summary || "No Title"}</Text>
      <Text style={styles.eventTime}>
        {formatEventTime(item.start)} - {formatEventTime(item.end)}
      </Text>
    </View>
  );

  const formatEventTime = (time: { dateTime?: string; date?: string }) => {
    if (time.dateTime) {
      return new Date(time.dateTime).toLocaleString();
    } else if (time.date) {
      return new Date(time.date).toLocaleDateString();
    } else {
      return "Unknown Time";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {!isSignedIn ? (
        <View style={styles.signInContainer}>
          <Button title="Sign in with Google" onPress={signIn} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Calendar</Text>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>No events found.</Text>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  eventItem: {
    marginBottom: 15,
    backgroundColor: "#2E2B3C",
    padding: 15,
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: "#ccc",
  },
  noEventsText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
