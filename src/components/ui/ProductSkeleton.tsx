type ProductSkeletonProps = {
  count?: number;
  columns?: number;
};

const shimmerClass =
  "relative overflow-hidden rounded-xl bg-slate-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-slate-200 before:via-slate-100 before:to-slate-200";

export const ProductSkeleton = ({
  count = 5,
  columns = 5,
}: ProductSkeletonProps) => (
  <div
    className="grid gap-4"
    style={{
      gridTemplateColumns: `repeat(${columns}, minmax(180px, 1fr))`,
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className={`${shimmerClass} h-60 w-full`} />

        <div className="space-y-3 p-3">
          <div className={`${shimmerClass} h-3 w-1/3 rounded-full`} />
          <div className={`${shimmerClass} h-4 w-4/5 rounded-lg`} />
          <div className={`${shimmerClass} h-5 w-2/3 rounded-lg`} />
          <div className={`${shimmerClass} h-3 w-1/4 rounded-full`} />
        </div>
      </div>
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="mx-auto max-w-8xl px-10 py-6">
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] md:items-start">
      <div className="space-y-5 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto md:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex w-20 flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`${shimmerClass} h-20 w-full rounded-xl`}
                />
              ))}
            </div>

            <div
              className={`${shimmerClass} h-[520px] flex-1 rounded-[22px]`}
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
          <div className="space-y-3">
            <div className={`${shimmerClass} h-4 w-28 rounded-full`} />
            <div className={`${shimmerClass} h-4 w-full rounded-full`} />
            <div className={`${shimmerClass} h-4 w-5/6 rounded-full`} />
            <div className={`${shimmerClass} h-4 w-3/4 rounded-full`} />
            <div className={`${shimmerClass} h-4 w-4/5 rounded-full`} />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-2 md:sticky md:top-6 md:self-start">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className={`${shimmerClass} h-7 w-20 rounded-full`} />
          <span>•</span>
          <div className={`${shimmerClass} h-7 w-24 rounded-full`} />
        </div>

        <div className="space-y-3">
          <div className={`${shimmerClass} h-10 w-full rounded-xl`} />
          <div className="flex flex-wrap items-center gap-2">
            <div className={`${shimmerClass} h-7 w-24 rounded-full`} />
            <div className={`${shimmerClass} h-7 w-24 rounded-full`} />
          </div>
        </div>

        <div className="rounded-2xl bg-[#fff8f4] p-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className={`${shimmerClass} h-4 w-20 rounded-full`} />
            <div className={`${shimmerClass} h-6 w-16 rounded-full`} />
          </div>
          <div className="mt-3 flex items-end gap-3">
            <div className={`${shimmerClass} h-12 w-40 rounded-xl`} />
            <div className={`${shimmerClass} h-5 w-24 rounded-full`} />
          </div>
        </div>

        <div className="space-y-2">
          <div className={`${shimmerClass} h-4 w-20 rounded-full`} />
          <div className="flex flex-wrap gap-2">
            <div className={`${shimmerClass} h-10 w-20 rounded-full`} />
            <div className={`${shimmerClass} h-10 w-20 rounded-full`} />
            <div className={`${shimmerClass} h-10 w-20 rounded-full`} />
          </div>
        </div>

        <div className="space-y-2">
          <div className={`${shimmerClass} h-4 w-20 rounded-full`} />
          <div className="flex flex-wrap gap-2">
            <div className={`${shimmerClass} h-10 w-16 rounded-full`} />
            <div className={`${shimmerClass} h-10 w-16 rounded-full`} />
            <div className={`${shimmerClass} h-10 w-16 rounded-full`} />
          </div>
        </div>

        <div className="space-y-2">
          <div className={`${shimmerClass} h-4 w-24 rounded-full`} />
          <div className="flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-2">
            <div className={`${shimmerClass} h-10 w-10 rounded-full`} />
            <div className={`${shimmerClass} h-6 w-10 rounded-full`} />
            <div className={`${shimmerClass} h-10 w-10 rounded-full`} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <div className={`${shimmerClass} h-12 flex-1 rounded-full`} />
          <div className={`${shimmerClass} h-12 flex-1 rounded-full`} />
        </div>
      </div>
    </div>
  </div>
);

import Masonry from "react-masonry-css";

type ProductCardSkeletonProps = {
  count?: number;
  className?: string;
};

const masonryBreakpoints = {
  default: 6,
  1280: 6,
  1024: 4,
  768: 3,
  640: 2,
};

const imageHeights = [
  "h-48",
  "h-64",
  "h-56",
  "h-72",
  "h-52",
  "h-80",
  "h-60",
];

export function ProductCardSkeleton({
  count = 20,
  className = "",
}: ProductCardSkeletonProps) {
  return (
    <Masonry
      breakpointCols={masonryBreakpoints}
      className={`flex -ml-3 sm:-ml-4 ${className}`}
      columnClassName="pl-3 sm:pl-4"
    >
      {Array.from({
        length: count,
      }).map((_, index) => {
        const imageHeight =
          imageHeights[
            index % imageHeights.length
          ];

        const hasLongTitle =
          index % 3 === 0;

        const hasShopName =
          index % 4 !== 0;

        const hasOldPrice =
          index % 3 === 1;

        const hasSoldBadge =
          index % 2 === 0;

        return (
          <div
            key={`skeleton-${index}`}
            className="mb-3 sm:mb-4"
          >
            <div
              className="
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
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

                  {hasLongTitle && (
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  )}
                </div>

                {/* Shop */}
                {hasShopName && (
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                )}

                {/* Price + sold */}
                <div className="flex items-end justify-between gap-3 pt-1">
                  <div className="space-y-1.5">
                    <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />

                    {hasOldPrice && (
                      <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
                    )}
                  </div>

                  {hasSoldBadge && (
                    <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Masonry>
  );
}


export default ProductSkeleton;
