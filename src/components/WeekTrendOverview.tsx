import { useMemo } from "react";
import { TbArrowsDiagonal } from "react-icons/tb";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { KpiAPIData, WeekTrendOverviewProps } from "../types/types";

type TrendSeriesKey =
  | "Fehlende_Doku"
  | "MVZ_Karten_Fehlen"
  | "MVZ_karten_ohne_Leistung"
  | "ohne_Leistung";

type TrendPoint = {
  name: string;
  Fehlende_Doku: number;
  MVZ_Karten_Fehlen: number;
  MVZ_karten_ohne_Leistung: number;
  ohne_Leistung: number;
};

const KPI_CONFIG: Array<{
  key: TrendSeriesKey;
  label: string;
  color: string;
}> = [
  { key: "Fehlende_Doku", label: "Fehlende Doku", color: "#2563eb" },
  { key: "MVZ_Karten_Fehlen", label: "MVZ Karten Fehlen", color: "#ef4444" },
  {
    key: "MVZ_karten_ohne_Leistung",
    label: "MVZ Karten ohne Leistung",
    color: "#9333ea",
  },
  { key: "ohne_Leistung", label: "Ohne Leistung", color: "#16a34a" },
];

const renderValueLabel =
  (color: string) =>
  ({
    x,
    y,
    value,
  }: {
    x?: number;
    y?: number;
    value?: number | string;
  }) => {
    if (x === undefined || y === undefined || value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value);
    const labelWidth = Math.max(28, stringValue.length * 7 + 10);
    const labelY = Math.max(y - 12, 14);

    return (
      <g>
        <rect
          x={x - labelWidth / 2}
          y={labelY - 11}
          width={labelWidth}
          height={16}
          rx={5}
          fill="#ffffff"
          fillOpacity={0.92}
        />
        <text
          x={x}
          y={labelY}
          fill={color}
          fontSize={10}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value}
        </text>
      </g>
    );
  };

const WeekTrendOverview = ({
  setFullscreenCard,
  fullscreen,
  data,
}: WeekTrendOverviewProps) => {
  const trendDataFromApi = data?.data;

  const chartData = useMemo<TrendPoint[]>(() => {
    if (!trendDataFromApi) {
      return [];
    }

    return trendDataFromApi.map((week: KpiAPIData, index: number) => ({
      name: `W${index + 1}`,
      ...week.kpis,
    }));
  }, [trendDataFromApi]);

  return (
    <div
      className={`md:col-span-2 bg-white rounded-2xl p-4 flex flex-col shadow-sm min-w-0 ${fullscreen === "trend" ? "h-full" : ""}`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            13-Week Trend Overview
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Weekly development split by KPI for better readability
          </p>
        </div>

        <div className="flex gap-4">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg flex justify-center items-center w-16 h-7">
            KW 1-13
          </span>
          {fullscreen === null && (
            <div className="border px-2 flex justify-center items-center border-gray-200 rounded-lg w-7 h-7 hover:scale-120 hover:bg-gray-100">
              <button onClick={() => setFullscreenCard("trend")}>
                <TbArrowsDiagonal />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 flex-1 min-h-0">
        {KPI_CONFIG.map((series) => (
          <div
            key={series.key}
            className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 px-4 py-4 flex flex-col min-h-[240px] shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: series.color }}
                />
                <p className="text-sm font-semibold text-slate-900">
                  {series.label}
                </p>
              </div>
              <p className="text-xl font-bold text-slate-900 tabular-nums">
                {chartData.length ? chartData[chartData.length - 1][series.key] : 0}
              </p>
            </div>

            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 30, right: 18, bottom: 22, left: 22 }}
                >
                  <CartesianGrid vertical={false} stroke="#cbd5e1" strokeOpacity={0.35} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "10px", fill: "#64748b" }}
                    dy={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "10px", fill: "#64748b" }}
                    width={34}
                    dx={-4}
                  />
                  <Line
                    type="monotone"
                    dataKey={series.key}
                    stroke={series.color}
                    strokeWidth={3}
                    dot={{ r: 3.5, strokeWidth: 2, fill: "#ffffff", stroke: series.color }}
                    activeDot={{ r: 5, stroke: series.color, fill: "#ffffff" }}
                    isAnimationActive={false}
                  >
                    <LabelList content={renderValueLabel(series.color)} />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekTrendOverview;
