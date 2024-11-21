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
  Recommendations: MainRecommendation[];
  AdditionalRecommendations: BaseRecommendation[];
}

export interface SearchRequest {
  term: string;
}
