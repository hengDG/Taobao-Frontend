// type ProductCardSkeletonProps = {
//   count?: number;
//   className?: string;
// };

// const imageHeights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-80", "h-60"];

// export function ProductCardSkeleton({
//   count = 15,
//   className = "",
// }: ProductCardSkeletonProps) {
//   return (
//     <div
//       className={`
//         columns-2 gap-3
//         sm:columns-3 sm:gap-4
//         md:columns-4
//         lg:columns-5
//         xl:columns-6
//         2xl:columns-7
//         ${className}
//       `}
//     >
//       {Array.from({ length: count }).map((_, index) => {
//         const imageHeight = imageHeights[index % imageHeights.length];

//         const hasLongTitle = index % 3 === 0;
//         const hasShopName = index % 4 !== 0;
//         const hasOldPrice = index % 3 === 1;
//         const hasSoldBadge = index % 2 === 0;

//         return (
//           <div
//             key={`skeleton-${index}`}
//             className="
//               mb-3
//               inline-block
//               w-full
//               break-inside-avoid
//               overflow-hidden
//               rounded-2xl
//               border
//               border-gray-200
//               bg-white
//               align-top
//               shadow-sm
//               sm:mb-4
//             "
//           >
//             {/* Image */}
//             <div
//               className={`
//                 w-full
//                 animate-pulse
//                 bg-slate-200
//                 ${imageHeight}
//               `}
//             />

//             {/* Content */}
//             <div className="space-y-2.5 p-3 sm:p-4">
//               {/* Category */}
//               <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

//               {/* Title */}
//               <div className="space-y-2">
//                 <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

//                 <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />

//                 {hasLongTitle ? (
//                   <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
//                 ) : null}
//               </div>

//               {/* Shop */}
//               {hasShopName ? (
//                 <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
//               ) : null}

//               {/* Price + Sold */}
//               <div className="flex items-end justify-between gap-3 pt-1">
//                 <div className="space-y-1.5">
//                   <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />

//                   {hasOldPrice ? (
//                     <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
//                   ) : null}
//                 </div>

//                 {hasSoldBadge ? (
//                   <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export function ProductCardSkeletonCard({ index = 0 }: { index?: number }) {
//   const imageHeight = imageHeights[index % imageHeights.length];

//   const hasLongTitle = index % 3 === 0;
//   const hasShopName = index % 4 !== 0;
//   const hasOldPrice = index % 3 === 1;
//   const hasSoldBadge = index % 2 === 0;

//   return (
//     <div
//       className={
//         "mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-gray-200 bg-white align-top shadow-sm sm:mb-4"
//       }
//     >
//       <div className={`w-full animate-pulse bg-slate-200 ${imageHeight}`} />

//       <div className="space-y-2.5 p-3 sm:p-4">
//         <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

//         <div className="space-y-2">
//           <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

//           <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />

//           {hasLongTitle ? (
//             <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
//           ) : null}
//         </div>

//         {hasShopName ? (
//           <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
//         ) : null}

//         <div className="flex items-end justify-between gap-3 pt-1">
//           <div className="space-y-1.5">
//             <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />

//             {hasOldPrice ? (
//               <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
//             ) : null}
//           </div>

//           {hasSoldBadge ? (
//             <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

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
        gap-4

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
  index = 0,
}: ProductCardSkeletonCardProps) {
  const hasLongTitle = index % 3 === 0;
  const hasDiscount = index % 3 === 1;

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
          aspect-[4/5]
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

        {hasLongTitle && (
          <div
            className="
                h-3
                w-1/2
                animate-pulse
                rounded
                bg-slate-200
              "
          />
        )}

        {/* BOTTOM PRICE AREA */}

        <div
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
            {/* price */}

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

          {/* sold badge */}

          <div
            className="
              h-5
              w-14
              animate-pulse
              rounded-full
              bg-slate-200
            "
          />
        </div>
      </div>
    </div>
  );
}
