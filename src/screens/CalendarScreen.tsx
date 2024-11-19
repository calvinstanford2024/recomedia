import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BottomNav } from "../components/BottomNav";
import { ItineraryItem } from "../components/ItineraryItem";

export const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Calendar</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today:</Text>
          <ItineraryItem icon="airplane" title="Flight to Los Angeles" />
          <ItineraryItem icon="baseball" title="Dodgers Game" />
          <ItineraryItem icon="leaf" title="Lake Hollywood Park" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tomorrow:</Text>
          <ItineraryItem icon="airplane" title="Flight to Philadelphia" />
          <ItineraryItem
            icon="book"
            title="Tour of Independence Hall and Liberty Bell"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wednesday:</Text>
          <ItineraryItem icon="cafe" title="Coffee at La Colombe in Fishtown" />
          <ItineraryItem
            icon="business"
            title="Eastern State Penitentiary Tour"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thursday:</Text>
          <ItineraryItem
            icon="trail-sign"
            title="Valley Forge National Historic Park"
          />
        </View>
      </ScrollView>
      <BottomNav />
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
});
