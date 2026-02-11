export interface DishInsight {
  dishName: string;
  vibeProfile: string;
  funFact: string;
  pairing: string;
}

export interface InsightsResponse {
  insights: DishInsight[];
}

export type AppState = "loading" | "ready" | "empty" | "error" | "not_shef" | "manual";
