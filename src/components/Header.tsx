import { useState, type ChangeEvent } from "react";
import type { HeaderArguments } from "../types/types";
import LiveTimer from "./LiveTimer";
import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";

const Header = ({
  locations,
  setLocationId,
  locationId,
  isFullscreen,
  onToggleFullscreen,
  refetch
}: HeaderArguments) => {
  const [isEngSelected, setIsEngselected] = useState<boolean>(false);

  const selectedLocation = locations?.find((location) => location.id === locationId)

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setLocationId(Number(id));
    localStorage.setItem("location", String(id));
  }

  return (
    <div className="bg-white w-full px-2 py-2 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="px-2 flex items-center gap-6 border-r border-gray-400">
          Icon
          <p className="font-bold">
            <span className=" text-blue-500">Fair</span>Doctors
          </p>
        </div>

        <div className="flex gap-2 items-center text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <LiveTimer/>
          <button
            className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:cursor-pointer transition flex items-center justify-center text-gray-500"
            onClick={() => refetch()}
          >
            ↻
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setIsEngselected(false)}
            className={`px-4 py-1.5 rounded-l-xl font-semibold text-xs hover:cursor-pointer ${!isEngSelected ? "bg-black text-white" : ""}`}
          >
            DE
          </button>
          <button
            onClick={() => setIsEngselected(true)}
            className={`px-4 py-1.5 rounded-r-xl ${isEngSelected ? "bg-black text-white" : ""} font-semibold text-xs hover:cursor-pointer`}
          >
            EN
          </button>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase hidden md:block">
          {selectedLocation?.locationName || "Location"}
        </p>
        <select 
        value={locationId || ""}
        onChange={handleLocationChange}
        className="w-35 px-2 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-200 hover:cursor-pointer">
          {locations && locations.map((location) => (
            <option value={location.id} key={location.id}>
              {location.locationName}
            </option>
          ))}
        </select>
        <button
          onClick={onToggleFullscreen}
          className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 hover:cursor-pointer transition inline-flex items-center gap-1.5"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <TbArrowsMinimize size={14} /> : <TbArrowsMaximize size={14} />}
          <span>{isFullscreen ? "Minimize" : "Fullscreen"}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
