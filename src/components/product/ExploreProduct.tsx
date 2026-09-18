import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";

import { useLanguage } from "@/contexts/LanguageContext";
import productService from "@/services/product/product.service";

import type { TaobaoProduct } from "@/types/taobao.types";

import { ProductCardSkeletonCard } from "../ui/ProductCardSkeleton";
import ServerError from "@/pages/ErrorPage";

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

type ExploreProductProps = {
  refreshKey?: number;
};

const ExploreProduct = ({ refreshKey = 0 }: ExploreProductProps) => {
  const { language } = useLanguage();

  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(false);

  const loadingRef = useRef(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const translationControllerRefs = useRef<AbortController[]>([]);

  const pendingTranslationQueueRef = useRef<string[]>([]);

  const activeTranslationCountRef = useRef(0);

  const requestedTitleOriginalsRef = useRef<Set<string>>(new Set());

  const abortPendingTranslations = useCallback(() => {
    translationControllerRefs.current.forEach((controller) =>
      controller.abort(),
    );
    translationControllerRefs.current = [];
    pendingTranslationQueueRef.current = [];
    activeTranslationCountRef.current = 0;
  }, []);

  // const processTranslationQueue = useCallback(async () => {
  //   if (activeTranslationCountRef.current >= 3) {
  //     return;
  //   }

  //   const source = pendingTranslationQueueRef.current.shift();

  //   if (!source) {
  //     return;
  //   }

  //   const controller = new AbortController();

  //   translationControllerRefs.current.push(controller);

  //   activeTranslationCountRef.current += 1;

  //   try {
  //     const response = await productService.translateTexts(
  //       [source],
  //       language,
  //       "title",
  //       controller.signal,
  //     );

  //     const translatedText = response.translations?.[source];

  //     if (translatedText) {
  //       setProducts((prevProducts) =>
  //         prevProducts.map((product) =>
  //           product.titleOriginal === source &&
  //           product.titleStatus === "pending" &&
  //           product.title === null
  //             ? {
  //                 ...product,
  //                 title: translatedText,
  //                 titleLang: language,
  //                 titleStatus: "ready",
  //               }
  //             : product,
  //         ),
  //       );
  //     }
  //   } catch (err) {
  //     if (controller.signal.aborted) {
  //       return;
  //     }

  //     console.error("Translate title error:", err);
  //   } finally {
  //     translationControllerRefs.current =
  //       translationControllerRefs.current.filter((item) => item !== controller);
  //     activeTranslationCountRef.current = Math.max(
  //       0,
  //       activeTranslationCountRef.current - 1,
  //     );

  //     if (pendingTranslationQueueRef.current.length > 0) {
  //       void processTranslationQueue();
  //     }
  //   }
  // }, [language]);

  const MAX_CONCURRENT_TRANSLATIONS = 2;

const processTranslationQueue = useCallback(() => {
  while (
    activeTranslationCountRef.current < MAX_CONCURRENT_TRANSLATIONS &&
    pendingTranslationQueueRef.current.length > 0
  ) {
    const source =
      pendingTranslationQueueRef.current.shift();

    if (!source) {
      continue;
    }

    const controller = new AbortController();

    translationControllerRefs.current.push(
      controller,
    );

    activeTranslationCountRef.current += 1;

    console.log(
      "Start translation:",
      source,
      "Active:",
      activeTranslationCountRef.current,
    );

    void productService
      .translateTexts(
        [source],
        language,
        "title",
        controller.signal,
      )
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        const translatedText =
          response.translations?.[source];

        // Backend may return nothing.
        // Leave product pending if translation failed.
        if (!translatedText) {
          console.log(
            "No translation returned:",
            source,
          );

          return;
        }

        setProducts((previousProducts) =>
          previousProducts.map((product) => {
            if (
              product.titleOriginal !== source ||
              product.titleStatus !== "pending" ||
              product.title !== null
            ) {
              return product;
            }

            return {
              ...product,

              title: translatedText,

              titleLang: language,

              titleStatus: "ready",
            };
          }),
        );
      })
      .catch((error: any) => {
        if (
          controller.signal.aborted ||
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(
          "Translate title error:",
          source,
          error,
        );
      })
      .finally(() => {
        translationControllerRefs.current =
          translationControllerRefs.current.filter(
            (item) => item !== controller,
          );

        activeTranslationCountRef.current =
          Math.max(
            0,
            activeTranslationCountRef.current - 1,
          );

        console.log(
          "Translation finished:",
          source,
          "Active:",
          activeTranslationCountRef.current,
        );

        // Fill empty translation slots.
        processTranslationQueue();
      });
  }
}, [language]);
  const enqueuePendingTranslations = useCallback(
    (incomingProducts: TaobaoProduct[]) => {
      const pendingSources = Array.from(
        new Set(
          incomingProducts
            .filter(
              (product) =>
                product.titleStatus === "pending" &&
                product.title === null &&
                typeof product.titleOriginal === "string" &&
                product.titleOriginal.trim().length > 0,
            )
            .map((product) => product.titleOriginal!.trim()),
        ),
      ).filter((source) => !requestedTitleOriginalsRef.current.has(source));

      pendingSources.forEach((source) => {
        requestedTitleOriginalsRef.current.add(source);
        pendingTranslationQueueRef.current.push(source);
      });

      if (pendingTranslationQueueRef.current.length > 0) {
        void processTranslationQueue();
      }
    },
    [processTranslationQueue],
  );

  // const fetchProducts = useCallback(
  //   async (nextCursor?: string | null) => {
  //     if (loadingRef.current) {
  //       return;
  //     }

  //     fetchControllerRef.current?.abort();
  //     const controller = new AbortController();
  //     fetchControllerRef.current = controller;

  //     try {
  //       loadingRef.current = true;

  //       if (nextCursor) {
  //         setLoadingMore(true);
  //       } else {
  //         setLoading(true);
  //       }

  //       setError(null);

  //       const response = await productService.getExploreProducts(
  //         nextCursor ?? undefined,
  //         language,
  //         controller.signal,
  //       );

  //       const newProducts = response.products ?? [];

  //       setProducts((prev) =>
  //         nextCursor ? [...prev, ...newProducts] : newProducts,
  //       );

  //       setCursor(response.nextCursor ?? null);

  //       setHasMore(Boolean(response.hasMore));

  //       if (newProducts.length > 0) {
  //         enqueuePendingTranslations(newProducts);
  //       }
  //     } catch (err) {
  //       if (controller.signal.aborted) {
  //         return;
  //       }

  //       console.error("Explore products error:", err);

  //       setError(
  //         err instanceof Error ? err.message : "Failed to load products",
  //       );
  //     } finally {
  //       loadingRef.current = false;

  //       setLoading(false);

  //       setLoadingMore(false);

  //       if (fetchControllerRef.current === controller) {
  //         fetchControllerRef.current = null;
  //       }
  //     }
  //   },
  //   [enqueuePendingTranslations, language],
  // );

  const fetchProducts = useCallback(
  async (nextCursor?: string | null) => {
    const isLoadMore = Boolean(nextCursor);

    // Prevent duplicate infinite-scroll requests only.
    // DO NOT block a fresh initial/reload request.
    if (isLoadMore && loadingRef.current) {
      return;
    }

    // A fresh load should replace any previous request.
    if (!isLoadMore) {
      fetchControllerRef.current?.abort();
    }

    const controller = new AbortController();

    fetchControllerRef.current = controller;
    loadingRef.current = true;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      console.log("Explore request start:", {
        language,
        cursor: nextCursor,
      });

      const response =
        await productService.getExploreProducts(
          nextCursor ?? undefined,
          language,
          controller.signal,
        );

      // Request was replaced/canceled
      if (controller.signal.aborted) {
        return;
      }

      // Another request became active after this one
      if (fetchControllerRef.current !== controller) {
        return;
      }

      console.log("Explore response:", response);

      const newProducts =
        response.products ?? [];

      setProducts((previousProducts) =>
        isLoadMore
          ? [
              ...previousProducts,
              ...newProducts,
            ]
          : newProducts,
      );

      setCursor(
        response.nextCursor ?? null,
      );

      setHasMore(
        Boolean(response.hasMore),
      );

      if (newProducts.length > 0) {
        enqueuePendingTranslations(
          newProducts,
        );
      }
    } catch (err: any) {
      if (
        controller.signal.aborted ||
        err?.name === "CanceledError" ||
        err?.code === "ERR_CANCELED"
      ) {
        console.log(
          "Explore request canceled",
        );

        return;
      }

      // Ignore an error from an old request
      if (
        fetchControllerRef.current !==
        controller
      ) {
        return;
      }

      console.error(
        "Explore products error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products",
      );
    } finally {
      // VERY IMPORTANT:
      // an old aborted request must not reset
      // the state of a newer active request.
      if (
        fetchControllerRef.current ===
        controller
      ) {
        loadingRef.current = false;

        setLoading(false);
        setLoadingMore(false);

        fetchControllerRef.current = null;
      }
    }
  },
  [
    enqueuePendingTranslations,
    language,
  ],
);

 useEffect(() => {
  abortPendingTranslations();

  requestedTitleOriginalsRef.current.clear();

  setProducts([]);
  setCursor(null);
  setHasMore(false);
  setError(null);

  void fetchProducts();
}, [
  abortPendingTranslations,
  fetchProducts,
  refreshKey,
]);

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

  useEffect(() => {
    return () => {
      fetchControllerRef.current?.abort();
      abortPendingTranslations();
    };
  }, [abortPendingTranslations]);

  console.log("ExploreProduct render", { loading, error, products, hasMore });
  return (
    <div className="w-full px-0 py-2 mx-auto max-w-8xl">
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
        <ServerError
          onRetry={() => {
            fetchProducts(cursor);
          }}
        />
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

          {hasMore && <div ref={loadMoreRef} className="h-10 " />}
        </>
      )}
    </div>
  );
};

export default ExploreProduct;
