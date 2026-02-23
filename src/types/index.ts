/** Average price indicators for travel (indicative, in EUR) */
export interface CountryPrices {
  flight?: string; // e.g. "400–800 € A/R"
  hotel?: string; // e.g. "80–150 € / nuit"
  localCost?: string; // e.g. "Vie locale : modérée"
}

export interface Country {
  id: string;
  name: string;
  nameFr?: string;
  code: string; // ISO 3166-1 alpha-2
  capital: string;
  population?: number;
  languages?: string[];
  currency?: string;
  flag?: string;
  fastFacts?: string[];
  bounds?: [[number, number], [number, number]]; // [[south, west], [north, east]]
  /** Image URLs for destination (carousel) */
  images?: string[];
  /** Best season to visit, e.g. "Octobre à avril" */
  bestSeason?: string;
  /** Average prices (flight, hotel, local life) */
  prices?: CountryPrices;
  /** Average rating out of 10 (e.g. 8.5) */
  rating?: number;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
  lat: number;
  lng: number;
  population?: number;
  facts: string[];
}

export interface Discovery {
  id: string;
  type: 'country' | 'city';
  name: string;
  countryCode: string;
  lat?: number;
  lng?: number;
  savedAt: number;
}

export type MapStyle = 'openstreetmap' | 'positron' | 'voyager';

export interface AppState {
  selectedCountryId: string | null;
  selectedCountry: Country | null;
  selectedCityId: string | null;
  selectedCity: City | null;
  discoveries: Discovery[];
  ui: {
    drawerOpen: boolean;
    panelOpen: boolean;
    mapZoom: number;
    mapStyle: MapStyle;
  };
  curiosityScores: Record<string, number>; // countryId -> score (0-100)
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    NAME?: string;
    NAME_EN?: string;
    ISO_A2?: string;
    ISO_A2_EH?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
