type ProductCardSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProductCardSkeleton({
  count = 5,
  className = "",
}: ProductCardSkeletonProps) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-5 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-64 animate-pulse bg-slate-200" />

          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-14 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
