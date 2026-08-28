import { useNavigate } from "react-router-dom";

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

const formatTaobaoPrice = (cents?: number | null) => {
  if (typeof cents !== "number") {
    return "Price on request";
  }

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);
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

  const title = isTaobaoProduct(product)
    ? (product.titleOriginal ?? product.title ?? "Untitled product")
    : getLocalizedText(product.title, language);

  const priceText = isTaobaoProduct(product)
    ? formatTaobaoPrice(
        product.couponCents ?? product.listCents ?? product.priceCents,
      )
    : product.priceText;

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
  };

  const hasDiscount =
    isTaobaoProduct(product) &&
    typeof product.listCents === "number" &&
    typeof product.couponCents === "number" &&
    product.couponCents < product.listCents;

  return (
    <article
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
        /*
         * IMPORTANT
         *
         * break-inside-avoid:
         * prevents masonry columns from
         * cutting a card in half.
         *
         * h-auto:
         * card follows its own content.
         *
         * inline-block + w-full:
         * works well with CSS columns.
         */
        "group mb-0 inline-block h-full w-full break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white align-top  transition duration-300   focus:outline-none focus:ring-2 focus:ring-[#194891]",
        // "group mb-0 inline-block h-full w-full break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white align-top  transition duration-300   focus:outline-none focus:ring-2 focus:ring-[#194891]",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* IMAGE */}
      {/* <div className="relative w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={
            title ||
            "Product image"
          }
          loading="lazy"
          className="
            block
            h-auto
            w-full
            object-contain
            transition-transform
            duration-500
            group-hover:scale-[1.02]
          "
        />

        
        {hasDiscount ? (
          <span className="absolute top-2 left-2 rounded-lg bg-[#ff5000] px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            Discount
          </span>
        ) : null}
      </div> */}

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

        {hasDiscount && (
          <span className="absolute top-2 left-2 rounded-lg bg-[#ff5000] px-2 py-1 text-[10px] font-bold text-white">
            Discount
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
          className="group/search absolute right-2 top-2 z-10 inline-flex items-center overflow-hidden rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:scale-95 focus:outline-none cursor-pointer focus:ring-2 focus:ring-[#194891]"
        >
          <span className="flex h-7 w-7 items-center justify-center transition-transform duration-200 group-hover/search:scale-110">
            <Search className="inline-block h-3.5 w-3.5" />
          </span>
          <span className="max-w-0 cursor-pointer overflow-hidden whitespace-nowrap text-[10px] font-semibold tracking-[0.12em] text-[#194891] opacity-0 transition-all duration-200 ease-out group-hover/search:max-w-[84px] group-hover/search:opacity-100 group-hover/search:pr-2.5">
            Search
          </span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-2.5 p-3 sm:p-2 ">
        {/* Category */}
        {/* {badgeText ? (
          <p className="text-[11px] font-medium tracking-[0.06em] text-slate-500">
            {badgeText}
          </p>
        ) : null} */}

        {/* TITLE
            No min-height.
            Long title = taller card.
            Short title = shorter card.
        */}
        <h3
          className="
    line-clamp-1
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

        {/* Shop */}
        {/* {shopName ? <p className="text-xs text-slate-500">{shopName}</p> : null} */}

        {/* Bottom */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex  items-center  gap-1">
            <div className="text-[16px] font-bold text-[#194891]">
              {priceText}
            </div>

            {hasDiscount && isTaobaoProduct(product) ? (
              <div className="mt-0.5 text-[11px] text-slate-400 line-through">
                {formatTaobaoPrice(product.listCents)}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {isTaobaoProduct(product) && product.soldLabel ? (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                {product.soldLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
