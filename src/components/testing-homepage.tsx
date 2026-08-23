import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getHomepageProducts } from "@/services/product/product.service";
import type { TaobaoHomeRow, TaobaoProduct } from "@/types/taobao.types";
import { ProductSkeleton } from "./ui/ProductSkeleton";

const formatPrice = (cents?: number | null) => {
  if (typeof cents !== "number") return "Price unavailable";

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const ProductCard = ({
  product,
  onSelect,
}: {
  product: TaobaoProduct;
  onSelect?: (product: TaobaoProduct) => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect?.(product)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(product);
      }
    }}
    className={`min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      product.sourceItemId ? "cursor-pointer" : "cursor-default"
    }`}
  >
    <img
      src={product.image}
      alt={product.title ?? "Product image"}
      className="block h-40 w-full bg-slate-100 object-cover"
    />

    <div className="space-y-3 p-3">
      <div className="text-[11px] text-slate-500">
        {product.categoryName ?? "Category"}
      </div>

      <div className="min-h-[42px] text-sm font-semibold leading-5 text-slate-800">
        {product.title ?? "No title"}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-slate-900">
            {formatPrice(
              product.couponCents ?? product.listCents ?? product.priceCents,
            )}
          </div>
          {product.listCents && (
            <div className="text-[11px] text-slate-400 line-through">
              {formatPrice(product.listCents)}
            </div>
          )}
        </div>

        <div className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
          {product.soldLabel ?? "New"}
        </div>
      </div>
    </div>
  </div>
);

const HomepageSectionList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<TaobaoHomeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true);
        const response = await getHomepageProducts();
        setRows(response.rows ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load homepage",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchHomepage();
  }, []);

  return (
    <div className="mt-5 px-3 sm:px-5">
      <div className="mb-4">
        <h3 className="m-0 text-2xl font-semibold text-slate-800">
          Homepage API Test
        </h3>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <div className="grid gap-5">
          <ProductSkeleton count={5} columns={5} />
        </div>
      ) : (
        <div className="grid gap-7">
          {rows.map((row) => (
            <div key={row.themeId ?? row.label ?? Math.random()}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="m-0 text-xl font-semibold text-slate-800">
                  {row.label ?? "Section"}
                </h4>
                <span className="text-xs text-slate-500">
                  {row.items?.length ?? 0} items
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {(row.items ?? []).slice(0, 10).map((product) => (
                  <ProductCard
                    key={product.sourceItemId ?? product.title}
                    product={product}
                    onSelect={(selectedProduct) => {
                      if (selectedProduct.sourceItemId) {
                        navigate(`/products/${selectedProduct.sourceItemId}`);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomepageSectionList;
