import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { getLocalizedText, type Language } from "@/contexts/LanguageContext";

import type { ProductCard as LocalizedProduct } from "@/types/product";
import type { TaobaoProduct } from "@/types/taobao.types";
import { Search } from "lucide-react";

export type ProductCardData = LocalizedProduct | TaobaoProduct;

type ProductCardProps<T extends ProductCardData = ProductCardData> = {
  product: T;
  language?: Language;
  onViewDetail?: (product: T) => void;
  onSelect?: (product: T) => void;
  className?: string;
  priority?: boolean;
};

const formatUsdPrice = (cents?: number | null) => {
  if (typeof cents !== "number") {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const formatKhrPrice = (
  value?: number | string | null,
  rawText?: string | null,
) => {
  if (typeof rawText === "string" && rawText.trim()) {
    return rawText.trim();
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value !== "number") {
    return "Price on request";
  }

  return new Intl.NumberFormat("km-KH", {
    style: "currency",
    currency: "KHR",
    maximumFractionDigits: 0,
  }).format(value);
};

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
  

  const [hovered, setHovered] = useState(false);
  const [firstHover, setFirstHover] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [enableSlideTransition, setEnableSlideTransition] = useState(true);

  const categoryText = isTaobaoProduct(product)
    ? (product.categoryName ?? "Fashion")
    : "Product";

  const title = isTaobaoProduct(product)
    ? (product.titleOriginal ?? product.title ?? "Untitled product")
    : getLocalizedText(product.title, language);

  const priceText = isTaobaoProduct(product)
    ? product.price?.usd ||
      formatUsdPrice(
        product.priceUsdCents ??
          product.couponCents ??
          product.listCents ??
          product.priceCents,
      )
    : product.priceText;

  const formatSoldLabel = (value?: number | string | null) => {
    if (!value) return "";

    const number = Number(String(value).replace(/[^0-9]/g, ""));

    if (Number.isNaN(number)) {
      return value;
    }

    if (number >= 1000) {
      const k = number / 1000;

      return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
    }

    if (number >= 100) {
      const k = number / 1000;

      return `${k.toFixed(1)}k`;
    }

    return String(number);
  };

  const originalPriceText = isTaobaoProduct(product)
    ? typeof product.originalPrice === "object" &&
      product.originalPrice !== null
      ? (product.originalPrice.usd ?? "")
      : typeof product.originalPrice === "number"
        ? formatUsdPrice(product.originalPrice)
        : null
    : null;

  const themeText = isTaobaoProduct(product)
    ? (product.themeLabel ?? "Popular")
    : "Product";

  const hasOriginalPrice = Boolean(
    originalPriceText && originalPriceText.trim(),
  );

  // const slideItems = hasOriginalPrice
  //   ? [
  //       {
  //         type: "original",
  //         content: originalPriceText,
  //       },
  //       {
  //         type: "category",
  //         content: categoryText,
  //       },
  //       {
  //         type: "theme",
  //         content: themeText,
  //       },

  //       // clone first item
  //       {
  //         type: "original",
  //         content: originalPriceText,
  //       },
  //     ]
  //   : [
  //       {
  //         type: "category",
  //         content: categoryText,
  //       },
  //       {
  //         type: "theme",
  //         content: themeText,
  //       },

  //       // clone first item
  //       {
  //         type: "category",
  //         content: categoryText,
  //       },
  //     ];

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

      // clone first item
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

  useEffect(() => {
    if (!hovered || !hasOriginalPrice) {
      setSlideIndex(0);
      return;
    }

    // first hover: fast move to category
    if (firstHover) {
      const timer = setTimeout(() => {
        setSlideIndex(1);
        setFirstHover(false);
      }, 300);

      return () => clearTimeout(timer);
    }

    // normal loop speed
    const timer = setInterval(() => {
      setSlideIndex((prev) => prev + 1);
    }, 1800);

    return () => clearInterval(timer);
  }, [hovered, hasOriginalPrice, firstHover]);

  useEffect(() => {
    if (slideIndex === slideItems.length - 1) {
      const timer = setTimeout(() => {
        setEnableSlideTransition(false);

        setSlideIndex(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setEnableSlideTransition(true);
          });
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [slideIndex, slideItems.length]);

  const imageUrl = isTaobaoProduct(product)
    ? product.image || "https://placehold.co/600x600/edf2f7/475569?text=Product"
    : product.imageUrl;

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

    if (productId) {
      navigate(`/products/${productId}`);
    }

    // if (productId) {
    //   const url = `/products/${productId}`;
    //   window.open(url, "_blank", "noopener,noreferrer");
    // }
  };
  const listCents = isTaobaoProduct(product) ? product.listCents : null;

  const couponCents = isTaobaoProduct(product) ? product.couponCents : null;

  const khrPrice = isTaobaoProduct(product)
    ? (product.price?.khr ?? product.priceKhr)
    : null;

  const khrDisplayValue =
    typeof khrPrice === "string"
      ? khrPrice
      : typeof khrPrice === "number"
        ? khrPrice
        : typeof listCents === "number"
          ? listCents
          : null;

  const hasDiscount =
    typeof listCents === "number" &&
    typeof couponCents === "number" &&
    listCents > 0 &&
    couponCents < listCents;

  const discountPercent = hasDiscount
    ? Math.max(1, Math.round(((listCents - couponCents) / listCents) * 100))
    : 0;

  return (
    <article
      onMouseEnter={() => {
        setHovered(true);
        setFirstHover(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setFirstHover(true);
      }}
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
      <div className="relative aspect-[4/4] w-full overflow-hidden bg-white">
        <img
          src={imageUrl}
          alt={title || "Product image"}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.02]
          "
        />

        {hasDiscount && discountPercent > 0 && (
          <span
            className="
    absolute
    left-2
    top-2
    rounded-sm
    border
    border-white/40
    bg-gradient-to-br
    from-red-500/70
    via-red-600/50
    to-orange-500/40
    px-2
    py-0
    text-[10px]
    font-bold
    text-white
    shadow-[0_0_15px_rgba(239,68,68,0.55)]
    backdrop-blur-xl
    backdrop-saturate-200
    ring-1
    ring-white/20
  "
          >
            {discountPercent}% off
          </span>
        )}

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
          className="
            group/search
            absolute
            right-2
            top-2
            z-10
            inline-flex
            items-center
            overflow-hidden
            rounded-full
            border
            border-white/80
            bg-white/90
            text-slate-600
            shadow-[0_8px_22px_rgba(15,23,42,0.12)]
            backdrop-blur-sm
            transition-all
            duration-200
            hover:bg-white
          "
        >
          <span
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
            "
          >
            <Search className="h-3 w-3" />
          </span>

          <span
            className="
              max-w-0
              overflow-hidden
              whitespace-nowrap
              text-[10px]
              font-semibold
              text-[#194891]
              opacity-0
              transition-all
              duration-200
              group-hover/search:max-w-[84px]
              group-hover/search:opacity-100
              group-hover/search:pr-2.5
            "
          >
            Search
          </span>
        </button>
      </div>

      <div className="space-y-0 p-3 sm:p-2">
        <h3
          className="
            line-clamp-2
            text-[13px]
            leading-5
            font-semibold
            text-slate-800
          "
        >
          <img
            src="/taobao icon.png"
            alt="Taobao"
            className="
              mr-1
              inline-block
              h-4
              w-4
              align-text-bottom
              object-contain
            "
          />

          {title}
        </h3>

        <div>
          {/* Vertical Slider */}
          <div className="relative h-5 overflow-hidden">
            <div
              className={`
      ${
        enableSlideTransition
          ? "transition-transform duration-500 ease-out"
          : ""
      }
    `}
              style={{
                transform: `translateY(-${slideIndex * 20}px)`,
              }}
            >
              {slideItems.map((item, index) => (
                <div key={index} className="h-5">
                  {item.type === "original" ? (
                    <div
                      className="
                text-[11px]
                text-slate-400 
              "
                    >
                      Before:{" "}
                      <span
                        className="text-[12px]

                font-bold
                line-through 
                text-[#c9171d] "
                      >
                        {item.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="
                flex
                h-5
                items-center
                text-[11px]
                font-semibold
                text-[#c68d06]
              "
                    >
                      {item.content} - China
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              <div
                className="
                  text-[16px]
                  font-bold
                  text-[#194891]
                "
              >
                {priceText}
              </div>

              {isTaobaoProduct(product) && (khrDisplayValue || hasDiscount) ? (
                <div
                  className="
                    mt-0.5
                    text-[11px]
                    text-slate-400
                  "
                >
                  ~{formatKhrPrice(khrDisplayValue, product.price?.khr ?? null)}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {isTaobaoProduct(product) && product.soldLabel ? (
                <span
                  className="
                    shrink-0
                    rounded-lg
                    bg-emerald-0
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    text-gray-400
                  "
                >
                  {/* {formatSoldLabel(product.soldLabel)} sold */}
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
