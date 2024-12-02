import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BottomNav } from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  "193482427987-l6psi1ecnjvrodtv255clp5g85aj42ec.apps.googleusercontent.com";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
];

export const CalendarScreen = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    scopes: GOOGLE_SCOPES,
    redirectUri: makeRedirectUri({
      scheme: "exp",
      path: "redirect",
    }),
    responseType: "token",
  });

  useEffect(() => {
    checkGoogleConnection();
  }, []);

  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === "success" && response.authentication) {
      try {
        // Store the token in Supabase
        const { error } = await supabase
          .from("users")
          .update({
            google_calendar_token: response.authentication.accessToken,
            google_token_expiry: new Date(
              Date.now() + (response.authentication.expiresIn ?? 3600) * 1000
            ).toISOString(),
          })
          .eq("username", "calvinlaughlin");

        if (error) throw error;

        setIsConnected(true);
      } catch (error) {
        console.error("Error saving Google token:", error);
      }
    }
  };

  const checkGoogleConnection = async () => {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("google_calendar_token")
        .eq("username", "calvinlaughlin")
        .single();

      setIsConnected(!!userData?.google_calendar_token);
    } catch (error) {
      console.error("Error checking Google connection:", error);
    }
  };

  const handleConnectGoogle = async () => {
    if (isConnected) {
      try {
        // Disconnect: Remove token from Supabase
        const { error } = await supabase
          .from("users")
          .update({
            google_calendar_token: null,
            google_token_expiry: null,
          })
          .eq("username", "calvinlaughlin");

        if (error) throw error;
        setIsConnected(false);
      } catch (error) {
        console.error("Error disconnecting Google Calendar:", error);
      }
    } else {
      // Connect: Start OAuth flow
      await promptAsync();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.connectButton, isConnected && styles.connectedButton]}
          onPress={handleConnectGoogle}
        >
          <Ionicons
            name={isConnected ? "calendar" : "calendar-outline"}
            size={24}
            color="#fff"
          />
          <Text style={styles.connectButtonText}>
            {isConnected
              ? "Connected to Google Calendar"
              : "Connect Google Calendar"}
          </Text>
        </TouchableOpacity>
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5DD3",
    padding: 15,
    borderRadius: 10,
    minWidth: 250,
    justifyContent: "center",
  },
  connectedButton: {
    backgroundColor: "#2E8B57",
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});
