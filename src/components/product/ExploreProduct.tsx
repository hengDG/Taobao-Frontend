import { useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";

import type { TaobaoProduct } from "@/types/taobao.types";

import productService from "@/services/product/product.service";

import { ProductCardSkeletonCard } from "../ui/ProductCardSkeleton";

const ExploreProduct = () => {
  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(false);

  // scroll trigger
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchProducts = async (nextCursor?: string | null) => {
    // prevent duplicate request
    if (loadingMore) {
      return;
    }

    try {
      if (nextCursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await productService.getExploreProducts(
        nextCursor ?? undefined,
      );

      console.log("EXPLORE RESPONSE:", response);

      const newProducts = response.products ?? [];

      // KEEP OLD DATA
      setProducts((prev) =>
        nextCursor ? [...prev, ...newProducts] : newProducts,
      );

      // UPDATE CURSOR
      setCursor(response.nextCursor ?? null);

      setHasMore(Boolean(response.hasMore));
    } catch (err) {
      console.error("EXPLORE ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Failed to fetch explore products",
      );
    } finally {
      setLoading(false);

      setLoadingMore(false);
    }
  };

  // first load
  useEffect(() => {
    void fetchProducts();
  }, []);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore && cursor && !loadingMore) {
          void fetchProducts(cursor);
        }
      },

      {
        threshold: 1,
      },
    );

    const element = loadMoreRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [cursor, hasMore, loadingMore]);

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
      {/* FIRST LOADING */}

      {loading && products.length === 0 && (
        <div
          className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              2xl:grid-cols-7
            "
        >
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <ProductCardSkeletonCard
              key={`explore-skeleton-${index}`}
              index={index}
            />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!error && products.length > 0 && (
        <>
          <div
            className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                2xl:grid-cols-7
              "
          >
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
                  key={`loading-more-${index}`}
                  index={index}
                />
              ))}
          </div>

          {/* SCROLL DETECTOR */}

          <div ref={loadMoreRef} className="h-10" />
        </>
      )}
    </div>
  );
};

export default ExploreProduct;
