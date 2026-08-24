import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { getThemeProducts } from "@/services/product/product.service";
import type { TaobaoProduct } from "@/types/taobao.types";

const TestingComponent = () => {
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard
              key={product.sourceItemId ?? product.title}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestingComponent;
