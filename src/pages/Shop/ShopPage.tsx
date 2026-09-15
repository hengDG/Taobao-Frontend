import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MapPin, Star, Heart } from "lucide-react";

const renderRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < fullStars) {
      return "full";
    }

    if (index === fullStars && hasHalfStar) {
      return "half";
    }

    return "empty";
  });

  return stars.map((type, index) => {
    if (type === "full") {
      return (
        <Star
          key={`star-${index}`}
          size={16}
          className="fill-yellow-400 text-yellow-400"
          fill="currentColor"
        />
      );
    }

    if (type === "half") {
      return (
        <div
          key={`star-${index}`}
          className="relative inline-flex h-4 w-4 items-center"
        >
          <Star size={16} className="text-slate-300" fill="none" />
          <Star
            size={16}
            className="absolute left-0 top-0 text-yellow-400"
            fill="currentColor"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    return (
      <Star
        key={`star-${index}`}
        size={16}
        className="text-slate-300"
        fill="none"
      />
    );
  });
};

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

import productService from "@/services/product/product.service";

import type { TaobaoProduct } from "@/types/taobao.types";

interface ShopInfo {
  id: string;
  name: string;
  rating: number;
  shippingOrigin: string;
}

export default function ShopPage() {
  const { shopId } = useParams();

  const [searchParams] = useSearchParams();

  const size = Number(searchParams.get("size") ?? "12");

  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  const [shop, setShop] = useState<ShopInfo | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setError("Missing shop id");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);

        const response = await productService.getShopProducts(shopId, size);

        setShop(
          response.shop
            ? {
                id: response.shop.id ?? shopId,
                name: response.shop.name ?? "Shop",
                rating: response.shop.rating ?? 0,
                shippingOrigin: response.shop.shippingOrigin ?? "",
              }
            : null,
        );

        setProducts(response.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed loading shop");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [shopId, size]);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8">
      {/* SHOP HEADER */}
      {shop && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            {/* logo */}
            <div className="flex h-25 w-25 items-center justify-center rounded-xl">
              <img src="/iconShop.png" alt="Shop Icon" className="h-25 w-25" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{shop.name}</h1>

              <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5">
                    {renderRatingStars(shop.rating)}
                  </span>

                  <span>{shop.rating}</span>
                </span>

                <span className="flex items-center gap-1">
                  <MapPin size={15} />
                  {shop.shippingOrigin} - China
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                <span className="rounded-md bg-orange-50 px-3 py-1 text-xs text-orange-600">
                  Product quality 4.9
                </span>

                <span className="rounded-md bg-green-50 px-3 py-1 text-xs text-green-600">
                  Fast shipping
                </span>

                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs text-blue-600">
                  Verified Store
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium hover:bg-slate-50">
              <Heart size={18} />
              Follow
            </button>

            <button className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white">
              Visit Store
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY */}
      {/* <div className="mb-5 flex items-center gap-8 rounded-xl border bg-white px-5 py-4">
    <button className="font-semibold text-orange-600">
      All products
    </button>

    <button>Men's clothing</button>
    <button>Women's clothing</button>
    <button>New Product</button>
    <button>Sales</button>
  </div> */}

      {/* ERROR */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      {/* PRODUCTS */}
      {loading ? (
        <ProductCardSkeleton count={18} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.sourceItemId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
