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

export type SearchResponse = {
  bannerUrl: string;
  Recommendations: Array<{
    Title: string;
    Year: string;
    Type: string;
    Creator: string;
    Reason: string;
    imageUrl: string;
  }>;
  AdditionalRecommendations: Array<{
    Title: string;
    Year: string;
    Type: string;
    Creator: string;
    Reason: string;
    imageUrl: string;
  }>;
};

export interface SearchRequest {
  term: string;
}
