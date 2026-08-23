import type { ProductCard as ProductCardType } from "@/types/product";
import { getLocalizedText, type Language } from "@/components/language-context";

type ProductCardProps = {
  product: ProductCardType;
  language: Language;
  onViewDetail?: (product: ProductCardType) => void;
};

export function ProductCard({
  product,
  language,
  onViewDetail,
}: ProductCardProps) {
  const title = getLocalizedText(product.title, language);
  const shopName = getLocalizedText(product.shopName, language);
  const section = getLocalizedText(product.section, language);
  const benefit = product.benefit
    ? getLocalizedText(product.benefit, language)
    : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#f5e9e3] bg-white/80 shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur-[2px] transition-transform duration-300 hover:-translate-y-1">
      <div className="block">
        <button
          type="button"
          onClick={() => onViewDetail?.(product)}
          className="block w-full cursor-pointer overflow-hidden p-0 text-left"
          aria-label={`View details for ${title}`}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={title}
              loading="lazy"
              className="w-full object-cover"
              style={{ height: "auto" }}
            />
          ) : (
            <div className="h-40 w-full bg-[#ece9e4]" />
          )}
        </button>

        <div className="space-y-2 p-3">
          <p className="line-clamp-2 text-sm font-semibold leading-5">
            {title}
          </p>
          <p className="text-xs text-zinc-500">{shopName}</p>

          <div className="flex items-center justify-between gap-5">
            <span className="text-base font-bold text-[#d61f00]">
              {product.priceText}
            </span>
            <span className="rounded-full bg-[#f2efe8] px-2 py-1 text-[11px] text-zinc-600">
              {section}
            </span>
          </div>

          {benefit ? (
            <p className="rounded-md bg-[#fff3ed] px-2 py-1 text-[11px] text-[#b7481f]">
              {benefit}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
