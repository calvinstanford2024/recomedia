import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { supabase, supabaseAdmin } from "../lib/supabase";

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading || !email || !password) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to sign in"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (
      loading ||
      !email ||
      !password ||
      !username ||
      !firstName ||
      !lastName
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              username,
              firstName,
              lastName,
            },
          },
        }
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create user");

      // 2. Create profile using admin client to bypass RLS
      const { error: profileError } = await supabaseAdmin.from("users").insert({
        id: authData.user.id,
        username,
        firstName,
        lastName,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        if (profileError.message?.includes("unique constraint")) {
          throw new Error(
            "Username is already taken. Please choose another one."
          );
        }
        throw new Error(
          `Failed to create user profile: ${profileError.message}`
        );
      }

      Alert.alert(
        "Account Created!",
        "Please check your email for the verification link. This may take a few minutes and might be in your spam folder. After verifying, you can sign in.",
        [
          {
            text: "OK",
            onPress: () => {
              setIsSignUp(false);
              setEmail("");
              setPassword("");
              setUsername("");
              setFirstName("");
              setLastName("");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred during sign up");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? "Create your account" : "Sign in to continue"}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ffffff80"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ffffff80"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isSignUp && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#ffffff80"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#ffffff80"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#ffffff80"
                value={lastName}
                onChangeText={setLastName}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setUsername("");
              setFirstName("");
              setLastName("");
            }}
          >
            <Text style={styles.buttonText}>
              {isSignUp ? "Already have an account? Sign In" : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B2E",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff80",
    marginBottom: 40,
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: "#ffffff15",
    borderRadius: 8,
    padding: 15,
    color: "#ffffff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6C5DD3",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    backgroundColor: "#ffffff20",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
