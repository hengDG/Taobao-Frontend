import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductCard } from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { searchProducts } from "@/services/product/product.service";
import type {
  TaobaoProduct,
  TaobaoProductsResponse,
} from "@/types/taobao.types";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<TaobaoProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keyword = searchParams.get("keyword") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "20");

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((total || 0) / size));
  }, [total, size]);

  useEffect(() => {
    const fetchProducts = async () => {
      const trimmedKeyword = keyword.trim();

      if (!trimmedKeyword) {
        setItems([]);
        setTotal(0);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response: TaobaoProductsResponse = await searchProducts(
          trimmedKeyword,
          page,
          size,
        );

        const responseItems = response.items ?? [];
        setItems(responseItems);

        if (typeof response.total === "number") {
          setTotal(response.total);
        } else if (responseItems.length >= size) {
          // API didn't provide total but returned a full page — assume more pages exist
          setTotal(page * size + 1);
        } else {
          setTotal(responseItems.length);
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load search results.",
        );
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, page, size]);

  const handlePageChange = (nextPage: number) => {
    const next = Math.max(1, nextPage);
    setSearchParams({ keyword, page: String(next), size: String(size) });
  };

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

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
            >
              <div className="h-64 bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-5 w-1/3 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {items.map((product) => (
              <ProductCard
                key={product.sourceItemId ?? product.title ?? product.image}
                product={product}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
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
