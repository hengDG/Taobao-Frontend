type ProductCardSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProductCardSkeleton({
  count = 12,
  className = "",
}: ProductCardSkeletonProps) {
  return (
    <div
      className={`
        grid
        grid-cols-2
        gap-2

        sm:grid-cols-3

        md:grid-cols-4

        lg:grid-cols-5

        xl:grid-cols-6

        ${className}
      `}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeletonCard key={`skeleton-${index}`} index={index} />
      ))}
    </div>
  );
}

type ProductCardSkeletonCardProps = {
  index?: number;
};

export function ProductCardSkeletonCard({
}: ProductCardSkeletonCardProps) {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* IMAGE */}
      <div
        className="
          relative
          aspect-[4/4]
          w-full
          animate-pulse
          bg-slate-200
        "
      />

      {/* CONTENT */}

      <div
        className="
          space-y-2.5
          p-3
          sm:p-2
        "
      >
        {/* TITLE WITH ICON */}

        <div
          className="
            flex
            items-center
            gap-1
          "
        >
          {/* taobao icon */}

          <div
            className="
              h-5
              w-5
              shrink-0
              animate-pulse
              rounded-full
              bg-slate-200
            "
          />

          <div
            className="
              h-3
              w-full
              animate-pulse
              rounded
              bg-slate-200
            "
          />
        </div>

        <div
          className="
            h-3
            w-4/5
            animate-pulse
            rounded
            bg-slate-200
          "
        />

        {/* {hasLongTitle && (
          <div
            className="
                h-3
                w-1/2
                animate-pulse
                rounded
                bg-slate-200
              "
          />
        )} */}

        {/* BOTTOM PRICE AREA */}

        {/* <div
          className="
            flex
            items-end
            justify-between
            gap-3
            pt-2
          "
        >
          <div
            className="
              space-y-2
            "
          >
           

            <div
              className="
                h-6
                w-20
                animate-pulse
                rounded
                bg-slate-200
              "
            />

            {hasDiscount && (
              <div
                className="
                    h-3
                    w-14
                    animate-pulse
                    rounded
                    bg-slate-200
                  "
              />
            )}
          </div>

         

          <div
            className="
              h-5
              w-14
              animate-pulse
              rounded-full
              bg-slate-200
            "
          />
        </div> */}
      </div>
    </div>
  );
}
