export type Mood = "calm" | "drama" | "discovery";
export type Interest =
  | "antiquity"
  | "renaissance"
  | "impressionism"
  | "modern"
  | "sculpture";
export type Company = "alone" | "couple" | "kids";
export type Duration = 30 | 60 | 90;

export type QuizAnswers = {
  duration: Duration;
  mood: Mood;
  interest: Interest;
  company: Company;
};

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  hall: string;
  period: string;
  tags: string[];
  mood: Mood[];
  interests: Interest[];
  durationHint: number;
  imageHue: number;
  fact: string;
};

export type RouteStop = {
  artworkId: string;
  story: string;
  whyForYou: string;
};

export type MuseumRoute = {
  title: string;
  theme: string;
  totalMinutes: number;
  stops: RouteStop[];
  source: "ai" | "fallback";
};

export type EnrichedStop = RouteStop & {
  artwork: Artwork;
};

export type EnrichedRoute = Omit<MuseumRoute, "stops"> & {
  stops: EnrichedStop[];
};
