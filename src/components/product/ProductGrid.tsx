// import { useMemo, useState } from "react";

// import { ProductCard } from "./ProductCard";

// import {
//   getLocalizedText,
//   useLanguage,
// } from "@/contexts/LanguageContext";

// import type { ProductCard as ProductCardType } from "@/types/product";

// type CategoryKey = "all" | string;

// type ProductGridProps = {
//   products: ProductCardType[];
//   onSelectProduct?: (product: ProductCardType) => void;
// };
// export function ProductGrid({
//   products,
//   onSelectProduct,
// }: ProductGridProps) {
//   const { language } = useLanguage();

//   const [activeCategory, setActiveCategory] =
//     useState<CategoryKey>("all");

//   const categoryEntries = useMemo(() => {
//     return Array.from(
//       products
//         .reduce(
//           (map, product) => {
//             // Use English value as stable category key
//             const categoryKey = product.section.en;

//             const current = map.get(categoryKey);

//             if (!current) {
//               map.set(categoryKey, {
//                 key: categoryKey,
//                 label: getLocalizedText(
//                   product.section,
//                   language,
//                 ),
//                 count: 1,
//               });

//               return map;
//             }

//             current.count += 1;

//             return map;
//           },
//           new Map<
//             string,
//             {
//               key: string;
//               label: string;
//               count: number;
//             }
//           >(),
//         )
//         .values(),
//     );
//   }, [language, products]);

//   const visibleProducts = useMemo(() => {
//     if (activeCategory === "all") {
//       return products;
//     }

//     return products.filter(
//       (product) =>
//         product.section.en === activeCategory,
//     );
//   }, [activeCategory, products]);

//   const allLabel =
//     language === "km" ? "ទាំងអស់" : "All";

//   const emptyStateText =
//     language === "km"
//       ? "មិនមានផលិតផលសម្រាប់ប្រភេទនេះទេ។"
//       : "No products found for this category.";

//   return (
//     <section className="min-h-screen bg-[#f6f4f2] text-[#1f1f1f]">
//       {/* Category Filter */}
//       <div className="sticky top-[68px] z-10 border-b bg-[#194791ca] text-white backdrop-blur">
//         <div
//           className="mx-auto flex w-full max-w-[98%] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6"
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//           }}
//         >
//           <button
//             type="button"
//             onClick={() =>
//               setActiveCategory("all")
//             }
//             className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
//               activeCategory === "all"
//                 ? "bg-[#1A478F] text-white"
//                 : "bg-white/20 text-white hover:bg-white/30"
//             }`}
//           >
//             {allLabel}
//           </button>

//           {categoryEntries.map((category) => {
//             const isActive =
//               activeCategory === category.key;

//             return (
//               <button
//                 key={category.key}
//                 type="button"
//                 onClick={() =>
//                   setActiveCategory(
//                     category.key,
//                   )
//                 }
//                 className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
//                   isActive
//                     ? "border-white bg-white text-[#194891]"
//                     : "border-white/25 bg-white/10 text-white hover:bg-white/20"
//                 }`}
//               >
//                 {category.label}

//                 <span className="ml-1 opacity-70">
//                   ({category.count})
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Products */}
//       <div className="mx-auto w-full max-w-[98%] px-3 py-6 sm:px-5">
//         <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7">
//           {visibleProducts.map((product) => (
//             <div
//               key={product.id}
//               className="mb-3 break-inside-avoid sm:mb-4"
//             >
//               <ProductCard
//                 product={product}
//                 language={language}
//                 onViewDetail={
//                   onSelectProduct
//                 }
//               />
//             </div>
//           ))}
//         </div>

//         {visibleProducts.length === 0 && (
//           <p className="rounded-xl bg-white p-6 text-center text-zinc-500">
//             {emptyStateText}
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }