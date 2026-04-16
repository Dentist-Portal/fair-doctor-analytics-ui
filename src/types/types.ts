export type WeekTrendOverviewProps = {
  setFullscreenCard: React.Dispatch<
    React.SetStateAction<"trend" | "summary" | "foxi" | null>
  >;
  fullscreen?: "trend" | "summary" | "foxi" | null;
  data: any;
};

export type KpiTrendData = {
  Fehlende_Doku: number;
  MVZ_Karten_Fehlen: number;
  MVZ_karten_ohne_Leistung: number;
  ohne_Leistung: number;
};

export type KpiAPIData = {
  week: string;
  weekStart: Date;
  weekEnd: Date;
  kpis: KpiTrendData;
};

export type Location = {
  id: number;
  locationName: string;
  zipCode: string;
  dentalUnits: number;
};

export type LocationsResponse = {
  data: Location[];
};

export type HeaderArguments = {
  locations: Location[];
  setLocationId: React.Dispatch<React.SetStateAction<number | null>>;
  locationId: number | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  refetch: () => void
};
