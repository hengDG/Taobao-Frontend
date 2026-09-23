import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ProductDetailSkeleton } from "@/components/ui/ProductSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import productService from "@/services/product/product.service";
import type { ProductCard as ProductCardType } from "@/shared/types";

import ServerError from "../ErrorPage";
import { ProductDetailView } from "./ProductDetailView";
import {
  applyProductDetailTranslations,
  normalizeProductDetailData,
} from "./productDetail.utils";
import ExploreProduct from "@/components/product/ExploreProduct";

export default function ProductDetailPage({
  onAddToCart,
}: {
  onAddToCart?: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
    quantity?: number,
  ) => void;
} = {}) {
  const { sourceItemId } = useParams();
  const { language } = useLanguage();

  const [product, setProduct] = useState<ProductCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const latestRequestKeyRef = useRef<string>("");
  const titleTranslationControllerRef = useRef<AbortController | null>(null);
  const titleTranslationRequestedRef = useRef<string | null>(null);

  const skuTranslationQueueRef = useRef<string[]>([]);
  const skuTranslationControllersRef = useRef<AbortController[]>([]);
  const skuTranslationCountRef = useRef(0);
  const requestedSkuNamesRef = useRef<Set<string>>(new Set());

  const abortSkuTranslations = useCallback(() => {
    skuTranslationControllersRef.current.forEach((controller) =>
      controller.abort(),
    );
    skuTranslationControllersRef.current = [];
    skuTranslationQueueRef.current = [];
    skuTranslationCountRef.current = 0;
  }, []);

  const translateProductTitle = useCallback(
    async (source: string) => {
      if (!source || titleTranslationRequestedRef.current === source) {
        return;
      }

      titleTranslationRequestedRef.current = source;
      const controller = new AbortController();
      titleTranslationControllerRef.current = controller;

      try {
        const response = await productService.translateTexts(
          [source],
          language,
          "title",
          controller.signal,
        );

        const translatedText = response.translations?.[source];

        if (!translatedText) {
          return;
        }

        setProduct((currentProduct) => {
          if (!currentProduct) {
            return currentProduct;
          }

          return {
            ...currentProduct,
            title: {
              ...currentProduct.title,
              [language]: translatedText,
            },
          };
        });
      } catch (error: any) {
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
          return;
        }

        console.error("TITLE TRANSLATION ERROR:", error);
      } finally {
        if (titleTranslationControllerRef.current === controller) {
          titleTranslationControllerRef.current = null;
        }

        if (!controller.signal.aborted) {
          titleTranslationRequestedRef.current = null;
        }
      }
    },
    [language],
  );

  const processSkuTranslationQueue = useCallback(async () => {
    if (skuTranslationCountRef.current >= 2) {
      return;
    }

    const source = skuTranslationQueueRef.current.shift();

    if (!source) {
      return;
    }

    const controller = new AbortController();
    skuTranslationControllersRef.current.push(controller);
    skuTranslationCountRef.current += 1;

    try {
      const response = await productService.translateTexts(
        [source],
        language,
        "sku",
        controller.signal,
      );

      const translatedText = response.translations?.[source];

      if (translatedText) {
        setProduct((currentProduct) => {
          if (!currentProduct) {
            return currentProduct;
          }

          return applyProductDetailTranslations(
            currentProduct,
            { [source]: translatedText },
            language,
          );
        });
      }
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }

      console.error("SKU translation error:", err);
    } finally {
      skuTranslationControllersRef.current =
        skuTranslationControllersRef.current.filter(
          (item) => item !== controller,
        );
      skuTranslationCountRef.current = Math.max(
        0,
        skuTranslationCountRef.current - 1,
      );

      if (skuTranslationQueueRef.current.length > 0) {
        void processSkuTranslationQueue();
      }
    }
  }, [language]);

  const queuePendingSkuTranslations = useCallback(
    (currentProduct: ProductCardType) => {
      const pendingSources = Array.from(
        new Set(
          (currentProduct.options ?? [])
            .flatMap((option) => [
              option.nameOriginal ?? option.name,
              ...option.values.map((value) => value.nameOriginal ?? value.name),
            ])
            .filter(
              (source): source is string =>
                typeof source === "string" &&
                source.trim().length > 0 &&
                !requestedSkuNamesRef.current.has(source.trim()) &&
                ((currentProduct.options ?? []).some(
                  (option) =>
                    (option.nameOriginal ?? option.name) === source &&
                    option.nameStatus === "pending",
                ) ||
                  (currentProduct.options ?? []).some((option) =>
                    option.values.some(
                      (value) =>
                        (value.nameOriginal ?? value.name) === source &&
                        value.nameStatus === "pending",
                    ),
                  )),
            ),
        ),
      ).map((source) => source.trim());

      pendingSources.forEach((source) => {
        requestedSkuNamesRef.current.add(source);
        skuTranslationQueueRef.current.push(source);
      });

      if (skuTranslationQueueRef.current.length > 0) {
        void processSkuTranslationQueue();
      }
    },
    [processSkuTranslationQueue],
  );

  useEffect(() => {
    if (!sourceItemId) {
      setError("Missing product id.");
      setLoading(false);
      return;
    }

    const normalizedId = decodeURIComponent(sourceItemId);
    const requestKey = `${normalizedId}:${language}`;
    latestRequestKeyRef.current = requestKey;

    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        abortSkuTranslations();
        requestedSkuNamesRef.current.clear();

        const data = await productService.getProductDetail(
          normalizedId,
          language,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        if (latestRequestKeyRef.current !== requestKey) {
          return;
        }

        const nextProduct = normalizeProductDetailData(
          data,
          normalizedId,
          language,
        );

        setProduct(nextProduct);

        const originalTitle = data?.titleOriginal?.trim();
        const shouldTranslateTitle =
          !data?.title ||
          data?.titleStatus === "pending" ||
          data?.titleLang !== language ||
          (data?.titleLang === null && !!originalTitle);

        if (shouldTranslateTitle && originalTitle) {
          void translateProductTitle(originalTitle);
        }

        queuePendingSkuTranslations(nextProduct);
      } catch (error: any) {
        if (controller.signal.aborted) {
          return;
        }

        if (latestRequestKeyRef.current !== requestKey) {
          return;
        }

        console.error("GET PRODUCT DETAIL ERROR:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load product.",
        );
      } finally {
        if (
          latestRequestKeyRef.current === requestKey &&
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      controller.abort();
      titleTranslationControllerRef.current?.abort();
      titleTranslationRequestedRef.current = null;
      abortSkuTranslations();
    };
  }, [
    abortSkuTranslations,
    language,
    queuePendingSkuTranslations,
    sourceItemId,
    translateProductTitle,
  ]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl p-10 mx-auto mt-5">
        <ServerError onRetry={() => window.location.reload()} />
      </div>
    );
  }
  console.log(product);

  return (
    <>
    <ProductDetailView
      product={product}
      onSelectProduct={() => {
        // keep handler local to the detail flow
      }}
      onAddToCart={(selectedProduct, selectedOptions, quantity) =>
        onAddToCart?.(selectedProduct, selectedOptions, quantity)
      }
    />
    <span className="block mt-10">
      <ExploreProduct  />
    </span>
    
    </>
    
  );
}
