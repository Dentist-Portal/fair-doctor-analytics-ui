import { useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  type PieSectorDataItem,
} from "recharts";
import type { WeekTrendOverviewProps } from "../types/types";
import { TbArrowsDiagonal } from "react-icons/tb";

type CustomSectorProps = PieSectorDataItem & {
  index?: number;
  cx?: number;
  cy?: number;
  midAngle?: number;
};

const renderShape = (props: CustomSectorProps, hoveredIndex: number | null) => {
  const isHovered = props.index === hoveredIndex;
  return (
    <Sector
      {...props}
      innerRadius={isHovered ? 56 : 55}
      outerRadius={isHovered ? 82 : 80}
    />
  );
};
export default function FoxyServiceEntries({
  setFullscreenCard,
  fullscreen,
  data
}: WeekTrendOverviewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const captured = data?.currentPercentage;
  const pending = data?.remainingPercentage;

  const pieData = [
    { name: "Captured", value: captured, fill: "#f59e0b" },
    { name: "Remaining", value: pending, fill: "#bfdbfe" },
  ];

  const progressRows = [
    { label: "Entered", value: captured, color: "bg-amber-500" },
    { label: "Pending", value: pending, color: "bg-blue-300" },
  ];

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Foxy Service Entries
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Capture rate vs. 100% target
          </p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            {pieData[0]?.value} / 100
          </span>

          {fullscreen === null && (
            <div className="border px-2 flex justify-center items-center border-gray-200 rounded-lg w-7 h-7 hover:scale-120 hover:bg-gray-100">
              <button onClick={() => setFullscreenCard("foxi")}>
                <TbArrowsDiagonal />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr] gap-6 items-center flex-1 mt-4">
        {/* bar chart(x-axis label needs fixing) */}
        <div className={`relative ${fullscreen === "foxi" ? "h-full" : "h-45"} w-45`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                shape={(props) => renderShape(props, hoveredIndex)}
                startAngle={180}
                endAngle={-180}
                stroke="none"
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                isAnimationActive
                animationDuration={450}
                animationEasing="ease-in-out"
                // fill=""
              >
                {/* <Cell fill="#f59e0b" />
                <Cell fill="#bfdbfe" /> */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-4xl font-bold text-amber-500 leading-none">
              {pieData[0].value}%
            </p>
            <p className="text-xs font-medium tracking-wide text-gray-400 mt-1">
              CAPTURED
            </p>
          </div>

          {/* Hover tooltip */}
          {hoveredIndex === 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-3/4 bg-white border border-gray-200 shadow-md rounded-xl px-3 py-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 rotate-45" />{" "}
              <p className="text-xs font-semibold text-gray-900">Entered</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-xs text-gray-500">Entered: 30%</span>
              </div>
            </div>
          )}

          {hoveredIndex === 1 && (
            <div className="absolute right-2 bottom-6 bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 z-10">
              {/* Tooltip arrow */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45" />

              <p className="text-xs font-semibold text-gray-900">Pending</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-sm bg-blue-300" />
                <span className="text-xs text-gray-500">Remaining: 70%</span>
              </div>
            </div>
          )}
        </div>

        {/* Right-side progress */}
        <div className="space-y-4">
          {progressRows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">{row.label}</span>
                <span className="font-semibold text-gray-900">
                  {row.value}%
                </span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`${row.color} h-full rounded-full`}
                  style={{ width: `${row.value}%` }}
                />
              </div>
            </div>
          ))}

          {/* Overall progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Overall progress</span>
              <span className="font-semibold text-gray-900">
                {pieData[0].value} / 100
              </span>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`bg-amber-500 h-full rounded-full w-[${pieData[0].value}%]`}
              />
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-600">
            ⚠ {pieData[1].value} entries remaining to target
          </div>
        </div>
      </div>
    </div>
  );
}
