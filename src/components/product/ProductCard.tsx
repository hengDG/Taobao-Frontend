import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { getLocalizedText, type Language } from "@/contexts/LanguageContext";
import type { ProductCard as LocalizedProduct } from "@/types/product";
import type { TaobaoProduct } from "@/types/taobao.types";

export type ProductCardData = LocalizedProduct | TaobaoProduct;

type ProductCardProps<T extends ProductCardData = ProductCardData> = {
  product: T;
  language?: Language;
  onViewDetail?: (product: T) => void;
  onSelect?: (product: T) => void;
  className?: string;
  priority?: boolean;
};

const SLIDE_INTERVAL_MS = 3000;
const SLIDE_TRANSITION_MS = 500;

// const SLIDE_INTERVAL_MS = 1500;
// const SLIDE_TRANSITION_MS = 350;

const isTaobaoProduct = (
  product: ProductCardData,
): product is TaobaoProduct => {
  return (
    "image" in product || "sourceItemId" in product || "categoryName" in product
  );
};

export function ProductCard<T extends ProductCardData = ProductCardData>({
  product,
  language = "en",
  onViewDetail,
  onSelect,
  className = "",
  priority = false,
}: ProductCardProps<T>) {
  const navigate = useNavigate();

  const cardRef = useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [enableSlideTransition, setEnableSlideTransition] = useState(true);

  // =====================================================
  // PRODUCT DATA
  // =====================================================

  const categoryText = isTaobaoProduct(product)
    ? (product.themeLabel ?? "Fashion")
    : "Product";

  const title = isTaobaoProduct(product)
    ? (product.title ?? product.titleOriginal ?? "Untitled product")
    : getLocalizedText(product.title, language);

  const usdPriceText = isTaobaoProduct(product)
    ? (product.price?.usd ?? "")
    : product.priceText;

  const rawKhrPrice = isTaobaoProduct(product)
    ? (product.price?.khr ?? "")
    : "";

  const originalPriceText = isTaobaoProduct(product)
    ? typeof product.originalPrice === "object" &&
      product.originalPrice !== null
      ? (product.originalPrice.usd ?? "")
      : typeof product.originalPrice === "number"
        ? String(product.originalPrice)
        : null
    : null;

  const hasOriginalPrice = Boolean(
    originalPriceText && originalPriceText.trim(),
  );

  // =====================================================
  // SLIDER ITEMS
  // =====================================================

  const slideItems = hasOriginalPrice
    ? [
        {
          type: "original",
          content: originalPriceText,
        },
        {
          type: "category",
          content: categoryText,
        },

        // Clone first item for smooth infinite loop
        {
          type: "original",
          content: originalPriceText,
        },
      ]
    : [
        {
          type: "category",
          content: categoryText,
        },
      ];

  // =====================================================
  // CHECK IF CARD IS VISIBLE
  // =====================================================

  useEffect(() => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,

        // Start slightly before the card enters the screen
        rootMargin: "150px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // AUTO SLIDE ONLY WHEN VISIBLE

  useEffect(() => {
    if (!isVisible || !hasOriginalPrice) {
      setSlideIndex(0);
      setEnableSlideTransition(true);
      return;
    }

    const timer = window.setInterval(() => {
      setSlideIndex((previous) => previous + 1);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [isVisible, hasOriginalPrice]);

  // INFINITE SLIDER RESET

  useEffect(() => {
    if (slideIndex !== slideItems.length - 1) {
      return;
    }

    if (slideItems.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      // Disable animation
      setEnableSlideTransition(false);

      // Jump back to real first item
      setSlideIndex(0);

      // Restore transition after browser renders reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableSlideTransition(true);
        });
      });
    }, SLIDE_TRANSITION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [slideIndex, slideItems.length]);

  // IMAGE

  const imageUrl = isTaobaoProduct(product)
    ? product.image || "https://placehold.co/600x600/edf2f7/475569?text=Product"
    : product.imageUrl;

  // SELECT PRODUCT

  const handleSelect = () => {
    if (onViewDetail) {
      onViewDetail(product);
      return;
    }

    if (onSelect) {
      onSelect(product);
      return;
    }

    const productId = isTaobaoProduct(product)
      ? product.sourceItemId
      : product.id;

    if (!productId) {
      return;
    }

    navigate(`/products/${productId}`, {
      state: {
        initialPrice: usdPriceText || null,
      },
    });
  };

  // PRICE / DISCOUNT

  const listCents = isTaobaoProduct(product) ? product.listCents : null;

  const couponCents = isTaobaoProduct(product) ? product.couponCents : null;

  const khrDisplayValue = isTaobaoProduct(product) ? rawKhrPrice : null;

  const hasDiscount =
    typeof listCents === "number" &&
    typeof couponCents === "number" &&
    listCents > 0 &&
    couponCents < listCents;

  const discountPercent = hasDiscount
    ? Math.max(1, Math.round(((listCents - couponCents) / listCents) * 100))
    : 0;

  // RENDER

  return (
    <article
      ref={cardRef}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
      className={[
        "group mb-0 inline-block h-full w-full break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white align-top transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[#194891]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/4] w-full overflow-hidden bg-white">
        <img
          src={imageUrl}
          alt={title || "Product image"}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* DISCOUNT */}
        {/* {hasDiscount && discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-sm border border-white/40 bg-gradient-to-br from-red-500/70 via-red-600/50 to-orange-500/40 px-2 py-0 text-[10px] font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.55)] backdrop-blur-xl backdrop-saturate-200 ring-1 ring-white/20">
            {discountPercent}% off
          </span>
        )} */}

        {/* SEARCH SIMILAR */}
        <button
          type="button"
          aria-label="Search similar products"
          title="Search similar products"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();

            const productId = isTaobaoProduct(product)
              ? (product.sourceItemId ?? product.itemId)
              : product.id;

            if (productId) {
              navigate(`/products/${encodeURIComponent(productId)}/similar`);
            }
          }}
          className="group/search absolute right-2 top-2 z-10 inline-flex items-center overflow-hidden rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-200 hover:bg-white"
        >
          <span className="flex h-6 w-6 items-center justify-center">
            <Search className="h-3 w-3" />
          </span>

          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold text-[#194891] opacity-0 transition-all duration-200 group-hover/search:max-w-[84px] group-hover/search:pr-2.5 group-hover/search:opacity-100">
            Search
          </span>
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="space-y-0 p-3 sm:p-2">
        {/* TITLE */}
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-800">
          <img
            src="/taobao icon.png"
            alt="Taobao"
            className="mr-1 inline-block h-4 w-4 align-text-bottom object-contain"
          />

          {title}
        </h3>

        <div>
          {/* AUTO VERTICAL SLIDER */}
          <div className="relative h-5 overflow-hidden">
            <div
              className={
                enableSlideTransition
                  ? "transition-transform duration-500 ease-out"
                  : ""
              }
              style={{
                transform: `translateY(-${slideIndex * 20}px)`,
              }}
            >
              {slideItems.map((item, index) => (
                // <div key={`${item.type}-${index}`} className="h-5">
                //   {item.type === "original" ? (
                //     // <div className="text-[11px] font-bold text-[#c9171d]">
                //     //   Before:{" "}
                //     //   <span className="text-[12px] font-bold text-[#c9171d] line-through">
                //     //     {item.content}
                //     //   </span>
                //     //   {hasDiscount && discountPercent > 0 && (
                //     //       <span className="ml-1 left-2 top-2 rounded-sm border  bg-red-400 px-2 py-0 text-[10px] font-bold text-white  backdrop-blur-xl backdrop-saturate-200 ring-1 ring-white/20">
                //     //         {discountPercent}% off
                //     //       </span>
                //     //     )}
                //     // </div>
                //     // Original price
                //     <div className="text-[11px] font-bold text-[#D92D20]">
                //       {/* Before: */}
                //       <span className="text-[12px] font-bold text-[#D92D20] line-through">
                //         {item.content}
                //       </span>
                //       {hasDiscount && discountPercent > 0 && (
                //         <span
                //           className="
                //             ml-1
                //             rounded-sm
                //             bg-[#F04438]
                //             px-2
                //             py-0
                //             text-[10px]
                //             font-bold
                //             text-white
                //             shadow-[0_0_5px_rgba(239,68,68,0.55)] backdrop-blur-xl backdrop-saturate-200 ring-1 ring-white/20
                //           "
                //         >
                //            {discountPercent}% OFF
                //         </span>
                //       )}
                //     </div>
                //   ) : (
                //     <div className="flex h-5 items-center text-[11px] font-semibold text-[#c68d06] background-[#ffffff]" >
                //       {item.content} - China
                //     </div>
                //   )}
                // </div>
                <div
                  key={`${item.type}-${index}`}
                  className="h-5 flex items-center"
                >
                  {item.type === "original" ? (
                    <div
                      className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-md
                            px-2
                            py-0.5
                            text-[11px]
                            font-bold
                            text-[#D92D20]
                          "
                    >
                      {/* <span className="text-[10px]">Before:</span> */}

                      <span
                        className="
                              text-[12px]
                              font-bold
                              text-[#D92D20]
                              line-through
                            "
                      >
                        {item.content}
                      </span>

                      {hasDiscount && discountPercent > 0 && (
                        <span
                          className="
                              inline-flex
                              items-center
                              gap-0.5
                              rounded-sm
                              bg-gradient-to-r
                              from-[#EF4444]
                              to-[#d51818]
                              px-1.5
                              py-[1px]
                              text-[9px]
                              font-bold
                              text-white
                              shadow-sm
                            "
                        >
                          {/* <BadgePercent size={11} strokeWidth={3.5} /> */}
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                            inline-flex
                            h-4
                            w-full
                            items-center
                            gap-1
                            bg-gradient-to-l
                            from-[#ffffff]
                            via-[#fcecaa]
                            to-[#fbd573ef]
                            px-1
                            rounded-sm
                            text-[11px]
                            font-semibold
                            text-[#896a01]
                          "
                    >
                      {/* <Globe2 size={11} strokeWidth={2.5}/> */}
                      {item.content} - China
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-1">
              <div className="text-[16px] font-bold text-[#194891]">
                {usdPriceText || "Price on request"}
              </div>

              {isTaobaoProduct(product) && khrDisplayValue ? (
                <div className="mt-0.5 text-[11px] text-slate-400">
                  {khrDisplayValue}
                </div>
              ) : null}
            </div>

            {/* SOLD */}
            <div className="flex items-center gap-2">
              {isTaobaoProduct(product) && product.soldLabel ? (
                <span className="shrink-0 rounded-lg bg-emerald-0 px-2 py-1 text-[10px] font-semibold text-gray-400">
                  {product.soldLabel} sold
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
