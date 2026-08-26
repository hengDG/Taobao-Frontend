import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";

import productService from "@/services/product/product.service";

import type { TaobaoProduct } from "@/types/taobao.types";

import { ProductCardSkeletonCard } from "../ui/ProductCardSkeleton";

const PRODUCT_GRID = `
grid
grid-cols-2
gap-2
sm:grid-cols-3
md:grid-cols-4
lg:grid-cols-5
xl:grid-cols-6
2xl:grid-cols-7
`;

const ExploreProduct = () => {
  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(false);

  const loadingRef = useRef(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchProducts = useCallback(async (nextCursor?: string | null) => {
    if (loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;

      if (nextCursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await productService.getExploreProducts(
        nextCursor ?? undefined,
      );

      const newProducts = response.products ?? [];

      setProducts((prev) =>
        nextCursor ? [...prev, ...newProducts] : newProducts,
      );

      setCursor(response.nextCursor ?? null);

      setHasMore(Boolean(response.hasMore));
    } catch (err) {
      console.error("Explore products error:", err);

      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      loadingRef.current = false;

      setLoading(false);

      setLoadingMore(false);
    }
  }, []);

  // initial loading

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // infinite scroll

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore && cursor) {
          void fetchProducts(cursor);
        }
      },

      {
        threshold: 0.5,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [cursor, hasMore, fetchProducts]);

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-8xl
        px-4
        py-2
      "
    >
      {loading && products.length === 0 && (
        <div className={PRODUCT_GRID}>
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <ProductCardSkeletonCard
              key={`explore-loading-${index}`}
              index={index}
            />
          ))}
        </div>
      )}

      {error && (
        <p
          className="
            text-red-500
            "
        >
          {error}
        </p>
      )}

      {!error && products.length > 0 && (
        <>
          <div className={PRODUCT_GRID}>
            {products.map((product) => (
              <ProductCard
                key={product.sourceItemId ?? product.title}
                product={product}
              />
            ))}

            {loadingMore &&
              Array.from({
                length: 10,
              }).map((_, index) => (
                <ProductCardSkeletonCard
                  key={`load-more-${index}`}
                  index={index}
                />
              ))}
          </div>

          {hasMore && (
            <div
              ref={loadMoreRef}
              className="
                h-10
                "
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExploreProduct;
