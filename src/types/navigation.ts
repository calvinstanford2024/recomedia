import type { SearchResponse } from "./api";
import type { SearchTerm } from "./common";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RecommendationDetail: {
    title: string;
    year: string;
    creator: string;
    description: string;
    reason: string;
    places_featured: string[];
    where_to_watch: string[];
    imageUrl: string;
    rating?: number;
  };
  SearchResult: {
    searchTerm: SearchTerm;
    searchResults: SearchResponse;
  };
  Profile: undefined;
};
