import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { getHomepageProducts } from "@/services/product/product.service";
import type { TaobaoHomeRow } from "@/types/taobao.types";

const HomepageSectionList = () => {
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
          <ProductSkeleton count={10} columns={5} />
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {(row.items ?? []).slice(0, 10).map((product) => (
                  <ProductCard
                    key={product.sourceItemId ?? product.title}
                    product={product}
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
