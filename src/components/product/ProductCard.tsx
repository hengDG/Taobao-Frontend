import { useNavigate } from "react-router-dom";

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
}: ProductCardProps<T>) {
  const navigate = useNavigate();

  const title = isTaobaoProduct(product)
    ? (product.titleOriginal ?? product.title ?? "Untitled product")
    : getLocalizedText(product.title, language);

  const shopName = isTaobaoProduct(product)
    ? (product.shopName ?? "")
    : getLocalizedText(product.shopName, language);

  const badgeText = isTaobaoProduct(product)
    ? (product.categoryName ?? product.soldLabel ?? "New")
    : getLocalizedText(product.section, language);

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
        "group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#194891]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="aspect-[4/4.2] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title || "Product image"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-3 p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
          {badgeText || "Category"}
        </p>

        <h3 className="min-h-[42px] text-sm font-semibold leading-5 text-slate-800">
          {title}
        </h3>

        {shopName && <div className="text-xs text-slate-500">{shopName}</div>}

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-[#194891]">{priceText}</div>
            {isTaobaoProduct(product) &&
              product.listCents &&
              product.listCents > (product.couponCents ?? 0) && (
                <div className="text-[11px] text-slate-400 line-through">
                  {formatTaobaoPrice(product.listCents)}
                </div>
              )}
          </div>

          {isTaobaoProduct(product) && product.soldLabel && (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
              {product.soldLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
