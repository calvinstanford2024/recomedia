import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://wvqpksnbyjjwtexwmloc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cXBrc25ieWpqd3RleHdtbG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNzI2NDQsImV4cCI6MjA0NzY0ODY0NH0.TXkGgAUbXMm9otFVuiMRiwFuMQVkCgYH-s_CVMW5egQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    persistSession: true,
  },
});
