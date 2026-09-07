import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductSkeleton";

import productService from "@/services/product/product.service";

import type { TaobaoHomeRow } from "@/types/taobao.types";
import ServerError from "@/pages/ErrorPage";

const HomepageSectionList = () => {
  const [rows, setRows] = useState<TaobaoHomeRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const loadHomepage = async () => {
    try {
      setLoading(true);
      setError(false);

      const result = await productService.getHomepageProducts();

      setRows(result.rows ?? []);
    } catch (error) {
      console.error(error);

      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepage();
  }, []);

  if (loading) {
    return <ProductCardSkeleton count={12} />;
  }

  if (error) {
    return (
      <ServerError
        onRetry={() => {
          loadHomepage();
        }}
      />
    );
  }

  return (
    <div className="mt-5 px-3 sm:px-5">
      {rows.map((row) => (
        <section key={row.themeId} className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">{row.label}</h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
