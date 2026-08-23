import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import { products } from "@/data/products";
import { ProductDetailPage } from "@/pages/products/ProductDetailPage";
import taobaoService from "@/services/taobao";
import type { CartLineItem } from "@/stores/cart.store";
import type { ProductCard as ProductCardType } from "@/types/product";

const HomePageLazy = lazy(() =>
  import("@/pages/home/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);

const CartPageLazy = lazy(() =>
  import("@/pages/cart/CartPage").then((module) => ({
    default: module.CartPage,
  })),
);

const Loader = () => (
  <div className="p-6 text-sm text-slate-600">Loading...</div>
);

const formatPriceValue = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "¥0.00";
  }

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(value / 100);
};

const normalizeApiProduct = (
  detail: {
    itemId?: string;
    sourceItemId?: string;
    title?: string;
    image?: string;
    images?: string[];
    category?: { name?: string };
    categoryName?: string;
    shop?: { name?: string };
    shopName?: string;
    soldLabel?: string;
    couponCents?: number | null;
    listCents?: number | null;
    priceCents?: number | null;
    description?: string;
    available?: boolean;
    totalQuantity?: number;
    options?: Array<{
      propId: string;
      name: string;
      values: Array<{ valueId: string; name: string }>;
    }>;
    skus?: Array<{
      skuId: string;
      selectionKey: string;
      priceRmbRaw: number;
      promotionPriceRmbRaw: number;
      quantity: number;
      available: boolean;
      selection: Record<string, string>;
    }>;
  },
  fallbackId: string,
): ProductCardType => {
  const normalizedId = detail.itemId ?? detail.sourceItemId ?? fallbackId;
  const firstAvailableSku =
    detail.skus?.find((sku) => sku.available && sku.quantity > 0) ??
    detail.skus?.[0];
  const salePrice = firstAvailableSku?.promotionPriceRmbRaw ?? 0;

  return {
    id: normalizedId,
    section: {
      en: detail.category?.name ?? detail.categoryName ?? "Product",
      km: detail.category?.name ?? detail.categoryName ?? "ផលិតផល",
    },
    title: {
      en: detail.title ?? "Product",
      km: detail.title ?? "ផលិតផល",
    },
    shopName: {
      en: detail.shop?.name ?? detail.shopName ?? "Taobao Store",
      km: detail.shop?.name ?? detail.shopName ?? "ហាង Taobao",
    },
    priceText: formatPriceValue(salePrice ? salePrice : undefined),
    imageUrl: detail.image ?? detail.images?.[0] ?? "",
    productUrl: `https://item.taobao.com/item.htm?id=${normalizedId}`,
    benefit: detail.soldLabel
      ? {
          en: detail.soldLabel,
          km: detail.soldLabel,
        }
      : undefined,
    gallery: detail.images ?? (detail.image ? [detail.image] : []),
    description: detail.description ?? "",
    categoryName: detail.category?.name ?? detail.categoryName ?? "Product",
    available: detail.available ?? true,
    totalQuantity: detail.totalQuantity ?? 0,
    options: detail.options ?? [],
    skus: detail.skus ?? [],
  };
};

type AppRoutesProps = {
  cartItems: CartLineItem[];
  onAddToCart: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
  ) => void;
  onUpdateCartQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
};

function ProductDetailRoute({
  onAddToCart,
  onBack,
}: {
  onAddToCart: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
  ) => void;
  onBack: () => void;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiProduct, setApiProduct] = useState<ProductCardType | null>(null);
  const [isLoading, setIsLoading] = useState(
    Boolean(id) && !products.some((item) => item.id === id),
  );

  const product = products.find((item) => item.id === id) ?? apiProduct;

  useEffect(() => {
    if (!id || products.some((item) => item.id === id)) {
      setApiProduct(null);
      setIsLoading(false);
      return;
    }

    let ignore = false;

    setIsLoading(true);
    taobaoService
      .getProductBySourceItemId(id)
      .then((detail) => {
        if (!ignore) {
          setApiProduct(normalizeApiProduct(detail, id));
        }
      })
      .catch(() => {
        if (!ignore) {
          setApiProduct(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (!product && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProductDetailPage
      product={product ?? null}
      onBack={onBack}
      onSelectProduct={(nextProduct: ProductCardType) =>
        navigate(`/product/${nextProduct.id}`)
      }
      onAddToCart={onAddToCart}
    />
  );
}

export function AppRoutes({
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveItem,
  onCheckout,
}: AppRoutesProps) {
  const navigate = useNavigate();

  const routes = [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loader />}>
          <HomePageLazy
            onSelectProduct={(product) => navigate(`/product/${product.id}`)}
          />
        </Suspense>
      ),
    },
    {
      path: "/cart",
      element: (
        <Suspense fallback={<Loader />}>
          <CartPageLazy
            items={cartItems}
            onContinueShopping={() => navigate("/")}
            onUpdateQuantity={onUpdateCartQuantity}
            onRemoveItem={onRemoveItem}
            onCheckout={() => {
              onCheckout();
              navigate("/");
            }}
          />
        </Suspense>
      ),
    },
    {
      path: "/product/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <ProductDetailRoute
            onAddToCart={(product, selectedOptions) => {
              onAddToCart(product, selectedOptions);
            }}
            onBack={() => navigate("/")}
          />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
