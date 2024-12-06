type Brand<K, T> = K & { __brand: T };

export type SearchTerm = Brand<string, "SearchTerm">;
export type ImageUrl = Brand<string, "ImageUrl">;

export type MediaType = "movie" | "series" | "book" | "song";
export type PlatformType =
  | "netflix"
  | "hulu"
  | "prime"
  | "apple"
  | "spotify"
  | "apple-music";

export type StreamingColor = {
  [K in PlatformType]: string;
};
