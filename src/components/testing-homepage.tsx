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
    const fetchHomepage = async () => {
      try {
        setLoading(true);

        const response = await productService.getHomepageProducts();
        setRows(response.rows ?? []);
      } catch (err) {
        console.error(err);

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
    <div
      className="
        mt-5
        px-3
        sm:px-5
      "
    >
      <div className="mb-4">
        <h3
          className="
            text-2xl
            font-semibold
            text-slate-800
          "
        >
          Homepage API Test
        </h3>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <ProductCardSkeleton count={12} />
      ) : (
        <div
          className="
            grid
            gap-8
          "
        >
          {rows.map((row) => (
            <section key={row.themeId ?? row.label}>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >
                <h4
                  className="
                    text-xl
                    font-semibold
                    text-slate-800
                  "
                >
                  {row.label ?? "Section"}
                </h4>

                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  {row.items?.length ?? 0} items
                </span>
              </div>

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
                {(row.items ?? []).slice(0, 10).map((product) => (
                  <ProductCard
                    key={product.sourceItemId ?? product.title}
                    product={product}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomepageSectionList;
