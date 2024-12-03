import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "../../App";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    "recomedia://",
    "com.recomedia.app://",
    "https://wvqpksnbyjjwtexwmloc.supabase.co",
  ],
  config: {
    screens: {
      HomeScreen: "",
      Login: "auth",
      ExploreScreen: "explore",
      CalendarScreen: "calendar",
      ProfileScreen: "profile",
      SearchResult: "search",
      RecommendationDetail: "recommendation/:id",
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
    return undefined;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    const subscription = Linking.addEventListener("url", onReceiveURL);
    return () => {
      subscription.remove();
    };
  },
};
