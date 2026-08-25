type ProductCardSkeletonProps = {
  count?: number;
  className?: string;
};

const imageHeights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-80", "h-60"];

export function ProductCardSkeleton({
  count = 15,
  className = "",
}: ProductCardSkeletonProps) {
  return (
    <div
      className={`
        columns-2 gap-3
        sm:columns-3 sm:gap-4
        md:columns-4
        lg:columns-5
        xl:columns-6
        2xl:columns-7
        ${className}
      `}
    >
      {Array.from({ length: count }).map((_, index) => {
        const imageHeight = imageHeights[index % imageHeights.length];

        const hasLongTitle = index % 3 === 0;
        const hasShopName = index % 4 !== 0;
        const hasOldPrice = index % 3 === 1;
        const hasSoldBadge = index % 2 === 0;

        return (
          <div
            key={`skeleton-${index}`}
            className="
              mb-3
              inline-block
              w-full
              break-inside-avoid
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              align-top
              shadow-sm
              sm:mb-4
            "
          >
            {/* Image */}
            <div
              className={`
                w-full
                animate-pulse
                bg-slate-200
                ${imageHeight}
              `}
            />

            {/* Content */}
            <div className="space-y-2.5 p-3 sm:p-4">
              {/* Category */}
              <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

              {/* Title */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />

                {hasLongTitle ? (
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                ) : null}
              </div>

              {/* Shop */}
              {hasShopName ? (
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              ) : null}

              {/* Price + Sold */}
              <div className="flex items-end justify-between gap-3 pt-1">
                <div className="space-y-1.5">
                  <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />

                  {hasOldPrice ? (
                    <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
                  ) : null}
                </div>

                {hasSoldBadge ? (
                  <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProductCardSkeletonCard({ index = 0 }: { index?: number }) {
  const imageHeight = imageHeights[index % imageHeights.length];

  const hasLongTitle = index % 3 === 0;
  const hasShopName = index % 4 !== 0;
  const hasOldPrice = index % 3 === 1;
  const hasSoldBadge = index % 2 === 0;

  return (
    <div
      className={
        "mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-gray-200 bg-white align-top shadow-sm sm:mb-4"
      }
    >
      <div className={`w-full animate-pulse bg-slate-200 ${imageHeight}`} />

      <div className="space-y-2.5 p-3 sm:p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />

          {hasLongTitle ? (
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          ) : null}
        </div>

        {hasShopName ? (
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        ) : null}

        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="space-y-1.5">
            <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />

            {hasOldPrice ? (
              <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
            ) : null}
          </div>

          {hasSoldBadge ? (
            <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
