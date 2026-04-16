import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const kpiService = createApi({
  reducerPath: "kpiService",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
  }),
  endpoints: (builder) => ({
    getLast13WeekTrend: builder.query({
      query: (locationId) => `kpi/last13weeks?locationId=${locationId}`,
    }),

    getSummary: builder.query({
      query: (locationId) => `last-working-day?locationId=${locationId}`,
    }),
    getFoxiChartData: builder.query({
      query: (locationId) =>
        `foxi-chart-last-working-day?locationId=${locationId}`,
    }),
    getLocations: builder.query<any, void>({
      query: () => `/locations`,
    }),
  }),
});

export const {
  useGetLast13WeekTrendQuery,
  useGetSummaryQuery,
  useGetFoxiChartDataQuery,
  useGetLocationsQuery,
} = kpiService;
