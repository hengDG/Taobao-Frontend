import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MapPin, Star, Heart } from "lucide-react";

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
        <div
          className="
rounded-2xl
bg-white
border
border-slate-200
shadow-sm
p-6
mb-6
flex
items-center
justify-between
"
        >
          <div className="flex items-center gap-5">
            {/* logo */}

            <div
              className="
h-25
w-25
rounded-xl
flex
items-center
justify-center
"
            >
              <img src="/iconShop.png" alt="Shop Icon" className="h-25 w-25" />
            </div>

            <div>
              <h1
                className="
text-2xl
font-bold
text-slate-900
"
              >
                {shop.name}
              </h1>

              <div
                className="
            flex
            items-center
            gap-4
            mt-2
            text-sm
            text-slate-500
            "
              >
                <span
                  className="
                flex
                items-center
                gap-1
                "
                >
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />

                  {shop.rating}
                </span>

                <span
                  className="
flex
items-center
gap-1
"
                >
                  <MapPin size={15} />

                  {shop.shippingOrigin}
                </span>
              </div>

              <div
                className="
flex
gap-3
mt-4
"
              >
                <span
                  className="
bg-orange-50
text-orange-600
px-3
py-1
rounded-md
text-xs
"
                >
                  Product quality 4.9
                </span>

                <span
                  className="
bg-green-50
text-green-600
px-3
py-1
rounded-md
text-xs
"
                >
                  Fast shipping
                </span>

                <span
                  className="
bg-blue-50
text-blue-600
px-3
py-1
rounded-md
text-xs
"
                >
                  Verified Store
                </span>
              </div>
            </div>
          </div>

          <div
            className="
flex
gap-3
"
          >
            <button
              className="
flex
items-center
gap-2
rounded-lg
border
px-5
py-3
text-sm
font-medium
hover:bg-slate-50
"
            >
              <Heart size={18} />
              Follow
            </button>

            <button
              className="
rounded-lg
bg-red-500
text-white
px-6
py-3
font-medium
"
            >
              Visit Store
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY */}

      {/* <div
        className="
bg-white
border
rounded-xl
mb-5
flex
items-center
gap-8
px-5
py-4
"
      >
        <button
          className="
font-semibold
text-orange-600
"
        >
          All products
        </button>

        <button>Men's clothing</button>

        <button>Women's clothing</button>

        <button>New Product</button>

        <button>Sales</button>
      </div> */}

      {/* ERROR */}

      {error && (
        <div
          className="
bg-red-50
text-red-600
p-4
rounded-xl
"
        >
          {error}
        </div>
      )}

      {/* PRODUCTS */}

      {loading ? (
        <ProductCardSkeleton count={18} />
      ) : (
        <div
          className="
grid
grid-cols-2
sm:grid-cols-3
md:grid-cols-4
lg:grid-cols-5
xl:grid-cols-6
gap-4
"
        >
          {products.map((product) => (
            <ProductCard key={product.sourceItemId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
