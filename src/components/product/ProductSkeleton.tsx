// import React from "react";

// type Props = {
//   count?: number;
// };

// const heights = ["h-48", "h-64", "h-56", "h-72", "h-40", "h-80"];

// export default function ProductSkeleton({ count = 8 }: Props) {
//   return (
//     <>
//       {Array.from({ length: count }).map((_, i) => (
//         <article
//           key={i}
//           className="animate-pulse mb-4 inline-block h-auto w-full break-inside-avoid overflow-hidden rounded-2xl border border-gray-200 bg-white"
//         >
//           <div
//             className={`w-full overflow-hidden bg-slate-100 ${heights[i % heights.length]}`}
//           />

//           <div className="space-y-3 p-4">
//             <div className="h-4 w-3/4 rounded bg-slate-200" />
//             <div className="h-4 w-1/2 rounded bg-slate-200" />
//             <div className="h-5 w-1/3 rounded bg-slate-200" />
//           </div>
//         </article>
//       ))}
//     </>
//   );
// }
