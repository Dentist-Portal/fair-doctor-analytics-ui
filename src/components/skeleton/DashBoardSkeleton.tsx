const ShimmerBlock = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-neutral-200 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
  </div>
);

const CardSkeleton = ({ wide = false }: { wide?: boolean }) => (
  <div
    className={`rounded-3xl bg-neutral-50 shadow-sm border border-neutral-200 p-4 ${
      wide ? "md:col-span-2" : ""
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <ShimmerBlock className="h-6 w-40" />
      <ShimmerBlock className="h-8 w-8 rounded-xl" />
    </div>

    <ShimmerBlock className="h-64 w-full rounded-2xl" />

    <div className="flex gap-2 mt-4">
      <ShimmerBlock className="h-4 flex-1" />
      <ShimmerBlock className="h-4 flex-1" />
      <ShimmerBlock className="h-4 flex-1" />
    </div>
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col w-full min-w-0">
      {/* Header skeleton */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <ShimmerBlock className="h-8 w-56" />
      </div>

        {/* Dashboard Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 px-2 w-full min-w-0">
        <CardSkeleton wide />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};

export default DashboardSkeleton;