import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ItineraryItem } from "../components/ItineraryItem";
import * as Calendar from "expo-calendar";
import { Ionicons } from "@expo/vector-icons";

interface CalendarEvent {
  title: string;
  startDate: Date;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const CalendarScreen = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    (async () => {
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

          console.log("Fetched Calendar Events:", eventsList);

          const formattedEvents = eventsList.map((event) => ({
            title: event.title,
            startDate: new Date(event.startDate),
            icon: getIconForEvent(event.title),
          }));

          console.log("Formatted Events:", formattedEvents);
          setEvents(formattedEvents);
        }
      } else {
        Alert.alert(
          "Permission Required",
          "Please allow calendar access to view your events",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  const getIconForEvent = (title: string): keyof typeof Ionicons.glyphMap => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes("flight")) return "airplane";
    if (lowercaseTitle.includes("meeting")) return "business";
    if (lowercaseTitle.includes("lunch") || lowercaseTitle.includes("dinner"))
      return "restaurant";
    if (lowercaseTitle.includes("coffee")) return "cafe";
    if (lowercaseTitle.includes("gym") || lowercaseTitle.includes("workout"))
      return "fitness";
    return "calendar"; // default icon
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

    console.log("Grouped Events:", groups);
    return groups;
  };

  const groupedEvents = groupEventsByDay(events);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Calendar</Text>

        {Object.entries(groupedEvents).map(([day, dayEvents]) => (
          <View key={day} style={styles.section}>
            <Text style={styles.sectionTitle}>{day}:</Text>
            {dayEvents.map((event, index) => (
              <ItineraryItem
                key={index}
                icon={event.icon}
                title={event.title}
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
});
