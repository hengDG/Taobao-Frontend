import { useNavigate } from "react-router-dom";

import type { TaobaoProduct } from "@/types/taobao.types";

import { ProductCard } from "@/components/product/ProductCard";

type ProductLinkSearchResultProps = {
  exactProduct: TaobaoProduct | null;
  similarProducts: TaobaoProduct[];
};

const formatPrice = (cents?: number | null) => {
  if (typeof cents !== "number") {
    return "Price on request";
  }

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

export function ProductLinkSearchResult({
  exactProduct,
  similarProducts,
}: ProductLinkSearchResultProps) {
  const navigate = useNavigate();

  const productDetailId =
    exactProduct?.sourceItemId ??
    exactProduct?.itemId ??
    exactProduct?.title ??
    "";

  const openDetail = () => {
    if (!productDetailId) {
      return;
    }

    navigate(`/products/${encodeURIComponent(productDetailId)}`);
  };

  if (!exactProduct) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        No product matched this link.
      </div>
    );
  }
  console.log(exactProduct);
  console.log(similarProducts);
  return (
    <div className="space-y-8 py-2">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Matched result
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Product Found
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={openDetail}
          className="block w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="relative aspect-4/5 overflow-hidden bg-slate-100 md:aspect-auto md:h-full">
              <img
                src={
                  exactProduct.image ||
                  "https://placehold.co/800x800/edf2f7/475569?text=Product"
                }
                alt={exactProduct.title || "Matched product"}
                className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
              />
            </div>

            <div className="space-y-3 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#ff6a00]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ff6a00]">
                  Taobao
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {exactProduct.sourceItemId ?? exactProduct.itemId ?? "Item"}
                </span>
              </div>

              <h3 className="text-lg font-bold leading-6 text-slate-900 md:text-xl">
                {exactProduct.titleOriginal ??
                  exactProduct.title ??
                  "Matched product"}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                {exactProduct.shopName && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">
                    {exactProduct.shopName}
                  </span>
                )}
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">
                  {(exactProduct.inStock ?? true) ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div className="flex flex-wrap items-end gap-3 pt-1">
                <span className="text-2xl font-black text-[#194891]">
                  {formatPrice(
                    exactProduct.couponCents ?? exactProduct.listCents ?? 0,
                  )}
                </span>
                {typeof exactProduct.listCents === "number" &&
                  typeof exactProduct.couponCents === "number" &&
                  exactProduct.couponCents < exactProduct.listCents && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(exactProduct.listCents)}
                    </span>
                  )}
              </div>
            </div>
          </div>
        </button>
      </section>

      {similarProducts.length > 0 && (
        <section className="pt-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recommended
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Similar Products
              </h2>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              {similarProducts.length} items
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6">
            {similarProducts.map((product) => (
              <ProductCard
                key={
                  product.sourceItemId ??
                  product.itemId ??
                  product.title ??
                  product.image
                }
                product={product}
                className="mb-0 border-0 shadow-none"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
