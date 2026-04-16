import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { TbArrowsDiagonal } from "react-icons/tb";
import { useMemo } from "react";
import type { KpiAPIData, WeekTrendOverviewProps } from "../types/types";

// const SmoothActiveDot = ({ cx, cy, stroke }) => {
//   return (
//     <circle
//       cx={cx}
//       cy={cy}
//       r={6}
//       fill={stroke}
//       stroke="white"
//       strokeWidth={2}
//       style={{
//         filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
//         transformOrigin: `${cx}px ${cy}px`,
//         animation: "dotPop 0.25s ease-out",
//       }}
//     />
//   );
// };

const WeekTrendOverview = ({
  setFullscreenCard,
  fullscreen,
  data
}: WeekTrendOverviewProps) => {
  // const data1 = [
  //   { name: "W1", uv: 400, pv: 2400, amt: 2400, si: 1800 },
  //   { name: "W2", uv: 300, pv: 4567, amt: 2900, si: 900 },
  //   { name: "W3", uv: 320, pv: 1398, amt: 1500, si: 2500 },
  //   { name: "W4", uv: 200, pv: 9800, amt: 2400, si: 1550 },
  //   { name: "W5", uv: 278, pv: 3908, amt: 2400, si: 2780 },
  //   { name: "W6", uv: 189, pv: 4800, amt: 2400, si: 2460 },
  // ];

  const trendDataFromApi = data?.data?.data;

  const COLORS = ["#2563eb", "#9333ea", "#ef4444", "#16a34a"];

  const chartData = useMemo(() => {
    if (!trendDataFromApi) return [];

    return trendDataFromApi.map((d: KpiAPIData, index: number) => ({
      name: `W${index + 1}`,
      ...d.kpis,
    }));
  }, [trendDataFromApi]);

  const legendItems = useMemo(() => {
    if (!chartData.length) return [];

    return Object.keys(chartData[0])
      .filter((key) => key !== "name")
      .map((key, index) => ({
        key,
        label: key.replaceAll("_", " "),
        color: COLORS[index],
      }));
  }, [chartData]);

  return (
    <div
      className={`md:col-span-2 bg-white rounded-2xl p-4  flex flex-col shadow-sm min-w-0 ${fullscreen === "trend" ? "h-full" : ""}`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            13-Week Trend Overview
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Weekly development across all four KPIs
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

      <div className="flex flex-wrap gap-4 mt-4 text-xs py-2 rounded-md px-4 text-gray-600 bg-blue-50">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-6 h-1 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div
        className={`${fullscreen === "trend" ? "flex-1 min-h-[80%]" : "h-45"} mt-4 min-w-0`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid vertical={true} strokeOpacity={0.25} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
              width="auto"
            />
            {legendItems.length > 0 &&
              legendItems.map((key, index) => (
                <Line
                  dataKey={key.key}
                  key={index}
                  stroke={`#${key.color}`}
                  strokeWidth={2}
                  type={"monotone"}
                  activeDot={{ stroke: `#${key.color}`, r: 4 }}
                  animationDuration={600}
                />
              ))}
             {/* <Line
              dataKey="uv"
              stroke="#2563eb"
              strokeWidth={2}
              type={"monotone"}
              activeDot={{ stroke: "#2563eb", r: 6 }}
              animationDuration={600}
            /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeekTrendOverview;
