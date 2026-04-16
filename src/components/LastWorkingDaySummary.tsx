// const SmartXAxisTick = ({ x, y, payload }: any) => {
//   const text = payload?.value ?? "";
//   const words = text.split(" ");

//   const lines =
//     words.length > 2
//       ? [
//           words.slice(0, Math.ceil(words.length / 2)).join(" "),
//           words.slice(Math.ceil(words.length / 2)).join(" "),
//         ]
//       : [text];

//       console.log(lines);

//   return (
//     <g transform={`translate(${x},${y + 10})`}>
//       <text textAnchor="middle" fill="#6b7280" fontSize={11}>
//         {lines.map((line, i) => (
//           <tspan key={i} x={0} dy={i === 0 ? 0 : 14}>
//             {line}
//           </tspan>
//         ))}
//       </text>
//     </g>
//   );
// };

const SmartXAxisTick = ({ x, y, payload }: any) => {
  const text = payload?.value ?? "";
  const maxCharsPerLine = window.innerWidth < 640 ? 8 : 12; // tweak based on chart width
  const maxLines = 3;

  const words = text.split(" ");
  const lines: string[] = [];

  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  const finalLines = lines.slice(0, maxLines).map((line, i) => {
    if (i === maxLines - 1 && lines.length > maxLines) {
      return line + "...";
    }
    return line;
  });

  return (
    <g transform={`translate(${x},${y + 10})`}>
      <text textAnchor="middle" fill="#6b7280" fontSize={11}>
        {finalLines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo } from "react";
import { TbArrowsDiagonal } from "react-icons/tb";
import type { WeekTrendOverviewProps } from "../types/types";

export default function LastWorkingDaySummary({
  setFullscreenCard,
  fullscreen,
  data,
}: WeekTrendOverviewProps) {
  // const data = [
  //   { name: "Mon", uv: 40 },
  //   { name: "Tue", uv: 30 },
  //   { name: "Wed", uv: 20 },
  //   { name: "Thu", uv: 28 },
  //   { name: "Fri", uv: 18 },
  //   { name: "Sat", uv: 24 },
  //   { name: "Sun", uv: 35 },
  // ];

  // const { data, isLoading, error } = useGetSummaryQuery(8);
  // const kpis2 = [
  //   { label: "Patients", value: 40 },
  //   { label: "Missing Docs", value: 12 },
  //   { label: "Insurance", value: 8 },
  //   { label: "Alerts", value: 3 },
  // ];

  const kpis = data?.kpis;

  const barChartData = useMemo(() => {
    if (!kpis) return [];

    return Object.keys(kpis).map((kpi) => ({
      label: kpi.replaceAll("_", " "),
      value: kpis[kpi],
    }));
  }, [kpis]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
      <div className="mb-4 flex justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Last Working Day Summary
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            KPI performance overview for the latest shift
          </p>
        </div>

        <div className="flex gap-4 justify-center items-center">
          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg flex justify-center items-center w-14 h-6">
            Today
          </span>
          {fullscreen === null && (
            <div className="border px-2 flex justify-center items-center border-gray-200 rounded-lg w-7 h-7 hover:scale-120 hover:bg-gray-100">
              <button onClick={() => setFullscreenCard("summary")}>
                <TbArrowsDiagonal />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`shrink-0 ${fullscreen === "summary" ? "h-[80%]" : "h-44"}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ bottom: 10, left: 10 }}
            // barCategoryGap={"20%"}
          >
            <CartesianGrid strokeOpacity={0.25} vertical={false}/>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={(props) => <SmartXAxisTick {...props} />}
              height={80}
              fontSize={12}
              minTickGap={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={"auto"}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
              cursor={false}
              // style={{ fontSize: "12px" }}
            />
            <Bar
              dataKey="value"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {barChartData.map((item) => (
          <div
            key={item.label}
            className="rounded-md bg-blue-50 border border-gray-100 px-1 flex justify-between items-center"
          >
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-md font-semibold text-gray-900 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
