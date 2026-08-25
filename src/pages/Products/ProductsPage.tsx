import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Masonry from "react-masonry-css";
import { ProductCard } from "@/components/product/ProductCard";
import useInfiniteProducts from "@/hooks/useInfiniteProducts";
import type { TaobaoProduct } from "@/types/taobao.types";
import {
  ProductCardSkeleton,
  ProductCardSkeletonCard,
} from "@/components/ui/ProductCardSkeleton";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const size = Number(searchParams.get("size") ?? "20");

  const {
    products: items,
    loading,
    error,
    hasMore,
    setObserverRef,
  } = useInfiniteProducts(keyword, size);
  const breakpoints = {
    default: 6,
    1280: 6,
    1024: 4,
    768: 3,
    640: 2,
  };
  console.log("ProductsPage render", { keyword, size, items, loading, error });
  return (
    <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Search Results
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {keyword ? `Results for “${keyword}”` : "Search products"}
          </h1>
        </div>

        {!loading && !error && keyword && (
          <div className="text-sm text-slate-500">
            {items.length} products found
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <ProductCardSkeleton count={12} />
      ) : items.length > 0 ? (
        <>
          <Masonry
            breakpointCols={breakpoints}
            className="flex -ml-4"
            columnClassName="pl-4"
          >
            {items.map((product: TaobaoProduct) => (
              <ProductCard
                key={product.sourceItemId ?? product.title ?? product.image}
                product={product}
              />
            ))}

            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeletonCard key={`skeleton-${i}`} index={i} />
              ))}
          </Masonry>

          {/* sentinel observed for infinite scroll */}
          <div ref={setObserverRef as any} className="mt-6 h-1" />

          {!hasMore && (
            <div className="mt-6 text-center text-sm text-slate-500">
              No more products
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          {keyword
            ? "No items matched your keyword. Try a different search."
            : "Use the search bar to look up products."}
        </div>
      )}
    </div>
  );
}
