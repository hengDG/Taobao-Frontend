import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import { ProductCard } from "@/components/product/ProductCard";
import {
  ProductCardSkeleton,
  ProductCardSkeletonCard,
} from "@/components/ui/ProductCardSkeleton";
import productService from "@/services/product/product.service";
import type { TaobaoProduct } from "@/types/taobao.types";
import ServerError from "@/pages/ErrorPage";

export default function ThemeProductsPage() {
//   const navigate = useNavigate();
  const location = useLocation();
  const { themeId } = useParams();

  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  // first page loading
  const [loading, setLoading] = useState(true);

  // next page loading
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // value returned from API
  const [nextScrollId, setNextScrollId] = useState<string | null>(null);

  // element at bottom of product list
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const categoryLabel =
    (location.state as { categoryLabel?: string } | null)?.categoryLabel ??
    (themeId ? `Theme ${themeId}` : "Products");

  // -----------------------------------------
  // First load
  // -----------------------------------------
  useEffect(() => {
    if (!themeId) {
      setError("Missing theme id.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadThemeProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // first request => no scrollId
        const response = await productService.getThemeProducts(
          themeId,
          undefined,
          controller.signal,
        );

        const items = Array.isArray(response)
          ? response
          : (response.items ?? []);

        if (!controller.signal.aborted) {
          setProducts(items);

          // save "22", "47", ...
          setNextScrollId(
            Array.isArray(response) ? null : (response.nextScrollId ?? null),
          );
        }
      } catch (caughtError) {
        if (controller.signal.aborted) return;

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to load theme products.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // reset when category/theme changes
    setProducts([]);
    setNextScrollId(null);

    void loadThemeProducts();

    return () => controller.abort();
  }, [themeId]);

  // -----------------------------------------
  // Load more
  // -----------------------------------------
  const loadMore = useCallback(async () => {
    if (!themeId) return;

    // no more pages
    if (!nextScrollId) return;

    // prevent multiple requests
    if (loadingMore) return;

    try {
      setLoadingMore(true);

      console.log("Loading scrollId:", nextScrollId);

      const response = await productService.getThemeProducts(
        themeId,
        nextScrollId,
      );

      const newItems = Array.isArray(response)
        ? response
        : (response.items ?? []);

      setProducts((previousProducts) => [...previousProducts, ...newItems]);

      // example:
      // 22 -> 47 -> 72 -> ...
      setNextScrollId(
        Array.isArray(response) ? null : (response.nextScrollId ?? null),
      );
    } catch (caughtError) {
      console.error("Failed to load more theme products:", caughtError);
    } finally {
      setLoadingMore(false);
    }
  }, [themeId, nextScrollId, loadingMore]);

  // Infinite scroll observer
  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;
    if (!nextScrollId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !loadingMore) {
          void loadMore();
        }
      },
      {
        // start loading slightly before
        // user reaches bottom
        rootMargin: "300px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, nextScrollId, loadingMore]);

  return (
    <div className="mx-auto max-w-8xl px-4 pb-6 pt-3 sm:px-6 lg:px-8">
      {/* Header */}
      <div
        className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between
        "
      >
        <div>
          <p
            className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500
            "
          >
            <span>Results for</span> "{categoryLabel}"
          </p>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <ServerError
          onRetry={() => {
            window.location.reload();
          }}
        />
      ) : null}

      {/* First loading */}
      {loading && products.length === 0 ? (
        <ProductCardSkeleton count={18} />
      ) : products.length > 0 ? (
        <>
          {/* Products */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product, index) => (
              <ProductCard
                key={
                  product.sourceItemId ??
                  product.itemId ??
                  `${product.image}-${index}`
                }
                product={product}
              />
            ))}

            {loadingMore &&
              Array.from({ length: 18 }).map((_, index) => (
                <ProductCardSkeletonCard key={`theme-loading-${index}`} />
              ))}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-10" />

          {/* End of results */}
          {!nextScrollId && !loadingMore && (
            <div className="py-8 text-center text-sm text-slate-400">
              You've reached the end.
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          No products found for this theme.
        </div>
      )}
    </div>
  );
}
