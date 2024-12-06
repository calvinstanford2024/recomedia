export interface BaseRecommendation {
  Type: "movie" | "series";
  Title: string;
  imageUrl: string;
}

export interface MainRecommendation extends BaseRecommendation {
  Year: string;
  Reason: string;
  Creator: string;
}

export interface SearchResponse {
  Recommendations: Recommendation[];
  AdditionalRecommendations: Recommendation[];
  bannerUrl?: string;
}

export interface SearchRequest {
  term: string;
}

export interface Recommendation {
  Title: string;
  Year: string;
  Creator: string;
  Type: string;
  Description?: string;
  Reason: string;
  imageUrl: string;
  Rating?: number;
  PlacesFeatured?: string[];
  WhereToWatch?: string[];
}
