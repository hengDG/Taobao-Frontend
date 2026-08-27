import { useCallback, useEffect, useRef, useState } from "react";

import productService from "@/services/product/product.service";
import type {
  TaobaoProduct,
  TaobaoProductsResponse,
  TaobaoExactProduct,
} from "@/types/taobao.types";

type UseInfiniteProductsResult = {
  products: TaobaoProduct[];
  exactProduct: TaobaoProduct | null;
  similarProducts: TaobaoProduct[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  // Attach this to a sentinel element at the end of the list
  setObserverRef: (node: Element | null) => void;
  // manual trigger if needed
  loadMore: () => void;
};

const mapExactProductToTaobaoProduct = (
  exact: TaobaoExactProduct | undefined,
): TaobaoProduct | null => {
  if (!exact) {
    return null;
  }

  const normalizedId = exact.sourceItemId ?? exact.itemId;

  return {
    itemId: exact.itemId ?? normalizedId,
    sourceItemId: normalizedId,
    title: exact.title,
    titleOriginal: exact.titleOriginal,
    image: exact.image,
    shopName: exact.shopName ?? undefined,
    couponCents: exact.couponCents ?? null,
    listCents: exact.listCents ?? null,
    priceCents: exact.listCents ?? null,
  };
};

export function useInfiniteProducts(
  keyword: string,
  size = 20,
  url?: string,
): UseInfiniteProductsResult {
  const [products, setProducts] = useState<TaobaoProduct[]>([]);
  const [exactProduct, setExactProduct] = useState<TaobaoProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<TaobaoProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setProducts([]);
    setExactProduct(null);
    setSimilarProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [keyword, size, url]);

  useEffect(() => {
    const fetchPage = async () => {
      const trimmedKeyword = keyword.trim();
      const trimmedUrl = url?.trim() ?? "";
      const isLinkSearch = Boolean(trimmedUrl);
      const query = isLinkSearch ? trimmedUrl : trimmedKeyword;

      if (!query) {
        setProducts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response: TaobaoProductsResponse = isLinkSearch
          ? await productService.searchByLink(query)
          : await productService.searchProducts(query, page, size);

        if (isLinkSearch) {
          const mappedExact = mapExactProductToTaobaoProduct(response.exact);
          const mappedSimilar = (response.similar ?? []).map((item) => ({
            itemId: item.itemId ?? item.sourceItemId,
            sourceItemId: item.sourceItemId ?? item.itemId,
            title: item.title,
            titleOriginal: item.titleOriginal,
            image: item.image,
            shopName: item.shopName ?? undefined,
            couponCents: item.couponCents ?? null,
            listCents: item.listCents ?? null,
            priceCents: item.listCents ?? null,
          }));

          setExactProduct(mappedExact ?? null);
          setSimilarProducts(mappedSimilar);
          setProducts(mappedExact ? [mappedExact] : []);
          setHasMore(false);
        } else {
          const items = response.items ?? [];

          setProducts((prev) => (page === 1 ? items : [...prev, ...items]));

          if (typeof response.total === "number") {
            const totalPages = Math.max(1, Math.ceil(response.total / size));
            setHasMore(page < totalPages);
          } else {
            setHasMore(items.length === size);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, page, size, url]);

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

  return {
    products,
    exactProduct,
    similarProducts,
    loading,
    error,
    hasMore,
    setObserverRef,
    loadMore,
  };
}

export default useInfiniteProducts;
