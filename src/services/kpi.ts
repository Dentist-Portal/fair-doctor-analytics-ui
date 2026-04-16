const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/$/, "");

export const getLocations = async () => {
  const res = await fetch(`${apiBaseUrl}/locations`);
  const data = await res.json();

  return data;
};

export const getSummary = async (locationId: number | null) => {
  const res = await fetch(`${apiBaseUrl}/last-working-day?locationId=${locationId}`);
  const data = await res.json();

  return data;
}

export const getLast13WeekTrend = async (locationId: number | null) => {
  const res = await fetch(`${apiBaseUrl}/kpi/last13weeks?locationId=${locationId}`)
  const data = await res.json();

  return data;
}

export const getFoxiChartData = async (locationId: number | null) => {
  const res = await fetch(`${apiBaseUrl}/foxi-chart-last-working-day?locationId=${locationId}`);
  const data = await res.json();

  return data;
}
