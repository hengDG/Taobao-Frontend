import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

import productService from "@/services/product/product.service";

import type { TaobaoProduct } from "@/types/taobao.types";

const ThemeProductsSection = () => {
  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError(null);

        const response = await productService.getPicks();

        if (mounted) {
          setProducts(response.items ?? []);
        }
      } catch (err) {
        console.error("Theme products error:", err);

        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch products",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-8xl
        px-4
        py-2
      "
    >
      {loading && <ProductCardSkeleton count={12} />}

      {error && (
        <p
          className="
              text-red-500
            "
        >
          {error}
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div
          className="
              grid
              grid-cols-2
              gap-3
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

      {!loading && !error && products.length === 0 && (
        <p className="text-slate-500">No products found.</p>
      )}
    </section>
  );
};

export default ThemeProductsSection;
