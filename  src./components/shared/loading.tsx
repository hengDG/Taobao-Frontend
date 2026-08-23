export function Loading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-[#e4ebff] bg-white px-4 py-2 text-sm font-medium text-[#194891] shadow-sm">
        <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-[#194891]" />
        Loading...
      </div>
    </div>
  );
}
