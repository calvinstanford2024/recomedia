import { ExpoConfig, ConfigContext } from "expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "recomedia",
  slug: "recomedia",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#1E1B2E",
  },
  scheme: "recomedia",
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY,
    eas: {
      projectId: "30cffc91-bf23-4d3f-98b6-c11a53a8d32c",
    },
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "15.1",
        },
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.recomedia.app",
    associatedDomains: ["applinks:wvqpksnbyjjwtexwmloc.supabase.co"],
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1E1B2E",
    },
    package: "com.recomedia.app",
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: "recomedia",
            host: "wvqpksnbyjjwtexwmloc.supabase.co",
            pathPrefix: "/auth/v1/callback",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
});
