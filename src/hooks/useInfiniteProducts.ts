import { useCallback, useEffect, useRef, useState } from "react";

import productService from "@/services/product/product.service";
import type {
  TaobaoProduct,
  TaobaoProductsResponse,
} from "@/types/taobao.types";

type UseInfiniteProductsResult = {
  products: TaobaoProduct[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  // Attach this to a sentinel element at the end of the list
  setObserverRef: (node: Element | null) => void;
  // manual trigger if needed
  loadMore: () => void;
};

export function useInfiniteProducts(
  keyword: string,
  size = 20,
): UseInfiniteProductsResult {
  const [products, setProducts] = useState<TaobaoProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // reset when keyword or size changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [keyword, size]);

  // fetch page
  useEffect(() => {
    const fetchPage = async () => {
      const trimmed = keyword.trim();
      if (!trimmed) {
        setProducts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response: TaobaoProductsResponse =
          await productService.searchProducts(trimmed, page, size);
        const items = response.items ?? [];

        setProducts((prev) => (page === 1 ? items : [...prev, ...items]));

        // If API gives total use it, otherwise infer from page length
        if (typeof response.total === "number") {
          const totalPages = Math.max(1, Math.ceil(response.total / size));
          setHasMore(page < totalPages);
        } else {
          setHasMore(items.length === size);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, page, size]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const setObserverRef = useCallback(
    (node: Element | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting && !loading && hasMore) {
            loadMore();
          }
        },
        { rootMargin: "400px" },
      );

      observerRef.current.observe(node);
    },
    [loadMore, loading, hasMore],
  );

  return { products, loading, error, hasMore, setObserverRef, loadMore };
}

export default useInfiniteProducts;
