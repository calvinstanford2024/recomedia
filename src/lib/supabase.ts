import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

if (!Constants.expoConfig?.extra?.supabaseUrl) {
  console.error("Missing EXPO_PUBLIC_SUPABASE_URL in environment variables");
}
if (!Constants.expoConfig?.extra?.supabaseAnonKey) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_ANON_KEY in environment variables"
  );
}
if (!Constants.expoConfig?.extra?.supabaseServiceKey) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_SERVICE_KEY in environment variables"
  );
}

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;
const supabaseServiceKey = Constants.expoConfig?.extra
  ?.supabaseServiceKey as string;

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
