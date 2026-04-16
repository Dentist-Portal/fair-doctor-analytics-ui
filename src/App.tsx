import { useEffect, useState } from "react";
import "./App.css";
import FoxyServiceEntries from "./components/FoxyServiceEntries";
import Header from "./components/Header";
import LastWorkingDaySummary from "./components/LastWorkingDaySummary";
import WeekTrendOverview from "./components/WeekTrendOverview";
import {
  useGetFoxiChartDataQuery,
  useGetLast13WeekTrendQuery,
  useGetLocationsQuery,
  useGetSummaryQuery,
} from "./services/kpi";
import DashboardSkeleton from "./components/skeleton/DashBoardSkeleton";
import { AnimatePresence, motion } from "framer-motion";
function App() {
  const [fullscreenCard, setFullscreenCard] = useState<
    null | "trend" | "foxi" | "summary"
  >(null);

  const [locationId, setLocationid] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const locationsQuery = useGetLocationsQuery();
  useEffect(() => {
    const locations = locationsQuery.data?.data;

    if (locations && locations.length > 0) {
      setLocationid(locations[0].id);
    }
  }, [locationsQuery]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const trendQuery = useGetLast13WeekTrendQuery(locationId, {
    pollingInterval: 10000,
    skip: !locationId,
  });
  const summaryQuery = useGetSummaryQuery(locationId, {
    pollingInterval: 10000,
    skip: !locationId,
  });
  const foxiQuery = useGetFoxiChartDataQuery(locationId, {
    pollingInterval: 10000,
    skip: !locationId,
  });

  const isDashboardLoading =
    trendQuery.isLoading ||
    summaryQuery.isLoading ||
    foxiQuery.isLoading ||
    locationsQuery.isLoading;

  if (isDashboardLoading) return <DashboardSkeleton />;

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Ignore fullscreen permission/runtime failures.
      }
      return;
    }

    try {
      await document.exitFullscreen();
    } catch {
      // Ignore fullscreen exit failures.
    }
  };

  const renderFullScreenCard = () => {
    switch (fullscreenCard) {
      case "trend":
        return (
          <WeekTrendOverview
            setFullscreenCard={setFullscreenCard}
            fullscreen={fullscreenCard}
            data={trendQuery.data}
          />
        );
      case "foxi":
        return (
          <FoxyServiceEntries
            setFullscreenCard={setFullscreenCard}
            fullscreen={fullscreenCard}
            data={foxiQuery.data}
          />
        );
      case "summary":
        return (
          <LastWorkingDaySummary
            setFullscreenCard={setFullscreenCard}
            fullscreen={fullscreenCard}
            data={summaryQuery.data}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full min-w-0">
      <Header
        locations={locationsQuery.data?.data}
        setLocationId={setLocationid}
        locationId={locationId}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 px-2 w-full min-w-0"
      >
        <WeekTrendOverview
          setFullscreenCard={setFullscreenCard}
          fullscreen={fullscreenCard}
          data={trendQuery.data}
        />
        <LastWorkingDaySummary
          setFullscreenCard={setFullscreenCard}
          fullscreen={fullscreenCard}
          data={summaryQuery.data}
        />
        <FoxyServiceEntries
          setFullscreenCard={setFullscreenCard}
          fullscreen={fullscreenCard}
          data={foxiQuery.data}
        />
        <AnimatePresence>
          {fullscreenCard && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                initial={{ y: 80, scale: 0.96, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 80, scale: 0.96, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                className="relative bg-white rounded-3xl w-full h-[90%] p-6 flex flex-col"
              >
                <button
                  onClick={() => setFullscreenCard(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-slate-700 text-white"
                >
                  ✕
                </button>

                <div className="flex-1 min-h-0 min-w-0">
                  {renderFullScreenCard()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
