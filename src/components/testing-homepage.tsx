import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";

import { ProductCardSkeleton } from "@/components/ui/ProductSkeleton";

import productService from "@/services/product/product.service";

import type { TaobaoHomeRow } from "@/types/taobao.types";

const HomepageSectionList = () => {
  const [rows, setRows] = useState<TaobaoHomeRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        setLoading(true);

        const result = await productService.getHomepageProducts();

        setRows(result.rows ?? []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Load failed");
      } finally {
        setLoading(false);
      }
    };

    loadHomepage();
  }, []);

  if (loading) {
    return <ProductCardSkeleton count={12} />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-5 px-3 sm:px-5">
      {rows.map((row) => (
        <section key={row.themeId} className="mb-8">
          <h3
            className="
text-xl
font-semibold
mb-4
"
          >
            {row.label}
          </h3>

          <div
            className="
grid
grid-cols-2
sm:grid-cols-3
md:grid-cols-4
lg:grid-cols-6
gap-4
"
          >
            {row.items?.map((product) => (
              <ProductCard key={product.sourceItemId} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomepageSectionList;
