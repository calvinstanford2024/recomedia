import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import {
  EXPO_PUBLIC_ANDROID_CLIENT_ID,
  EXPO_PUBLIC_IOS_CLIENT_ID,
  EXPO_PUBLIC_WEB_CLIENT_ID,
} from "@env";

WebBrowser.maybeCompleteAuthSession();

export const CalendarScreen = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: EXPO_PUBLIC_WEB_CLIENT_ID,
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
      redirectUri: AuthSession.makeRedirectUri(),
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication) {
        setAccessToken(authentication.accessToken);
        fetchUserInfo(authentication.accessToken);
        fetchCalendarEvents(authentication.accessToken);
      }
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchCalendarEvents = async (token: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.items) {
        setCalendarEvents(data.items);
      } else {
        console.log("No calendar events found.");
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.title}>Welcome, {userInfo.name}!</Text>
          <FlatList
            data={calendarEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventTitle}>{item.summary}</Text>
                <Text style={styles.eventTime}>
                  {item.start?.dateTime || item.start?.date} -{" "}
                  {item.end?.dateTime || item.end?.date}
                </Text>
              </View>
            )}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>
            Sign in with Google to view your calendar events!
          </Text>
          <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 20,
  },
  eventItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
});
