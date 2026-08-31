import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import productService from "@/services/product/product.service";
import type { TaobaoProduct } from "@/types/taobao.types";

export default function SimilarProductsPage() {
  const navigate = useNavigate();
  const { sourceItemId } = useParams();
  const [products, setProducts] = useState<TaobaoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceItemId) {
      setError("Missing product id.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productService.getSimilarProducts(
          sourceItemId,
          20,
        );
        const items = Array.isArray(response)
          ? response
          : (response.items ?? response.similar ?? []);

        setProducts(items);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to load similar products.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadSimilarProducts();

    return () => controller.abort();
  }, [sourceItemId]);

  return (
    <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8 mt-10">
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Similar products
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Products like this item
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Back
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading && products.length === 0 ? (
        <ProductCardSkeleton count={18} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <div
              key={
                product.sourceItemId ??
                product.itemId ??
                product.title ??
                product.image
              }
              className="space-y-2"
            >
              <ProductCard product={product} />
              {/* <div className="px-1 text-sm font-semibold text-[#194891]">
                {formatPrice(
                  product.couponCents ??
                    product.listCents ??
                    product.priceCents,
                )}
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          No similar products found for this item.
        </div>
      )}
    </div>
  );
}
