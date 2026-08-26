import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import type { TaobaoProduct } from "@/types/taobao.types";
import { ProductCardSkeleton } from "./ui/ProductCardSkeleton";
import productService from "@/services/product/product.service";

const TestingComponent = () => {
  const [products, setProducts] = useState<TaobaoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await productService.getThemeProducts("11647");

        setProducts(response.items ?? []);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-8xl
        px-4
        py-2
      "
    >
      <div className="mb-5">
        <h3
          className="
            text-2xl
            font-semibold
            text-slate-800
          "
        >
          Theme Products Test
        </h3>
      </div>

      {loading && <ProductCardSkeleton count={12} />}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div
          className="
            grid
            grid-cols-2
            gap-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            2xl:grid-cols-7
          "
        >
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
