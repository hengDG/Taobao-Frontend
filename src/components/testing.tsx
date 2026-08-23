import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { getThemeProducts } from "@/services/product/product.service";
import type { TaobaoProduct } from "@/types/taobao.types";

const formatPrice = (cents?: number | null) => {
  if (typeof cents !== "number") return "Price unavailable";

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const TestingComponent = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<TaobaoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getThemeProducts("11647");
        setProducts(response.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-5">
        <h3 className="m-0 text-2xl font-semibold text-slate-800">
          Theme Products Test
        </h3>
      </div>

      {loading && (
        <div className="mt-3">
          <ProductSkeleton count={5} columns={5} />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <a
              key={product.sourceItemId ?? product.title}
              role="button"
              tabIndex={0}
              target="_blank"
              href={
                product.sourceItemId
                  ? `/products/${product.sourceItemId}`
                  : undefined
              }
              onClick={() => {
                if (product.sourceItemId) {
                  navigate(`/products/${product.sourceItemId}`);
                }
              }}
              onKeyDown={(event) => {
                if (
                  (event.key === "Enter" || event.key === " ") &&
                  product.sourceItemId
                ) {
                  event.preventDefault();
                  navigate(`/products/${product.sourceItemId}`);
                }
              }}
              className={`group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                product.sourceItemId ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <img
                src={product.image}
                alt={product.title ?? "Product image"}
                className="block h-52 w-full bg-slate-100 object-cover"
              />

              <div className="space-y-3 p-3">
                <div className="text-[11px] text-slate-500">
                  {product.categoryName ?? "Category"}
                </div>

                <div className="min-h-10 text-sm font-semibold leading-5 text-slate-800">
                  {product.title ?? "No title"}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {formatPrice(
                        product.couponCents ??
                          product.listCents ??
                          product.priceCents,
                      )}
                    </div>
                    {product.listCents && (
                      <div className="text-xs text-slate-400 line-through">
                        {formatPrice(product.listCents)}
                      </div>
                    )}
                  </div>

                  <div className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                    {product.soldLabel ?? "New"}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestingComponent;
