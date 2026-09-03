import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { AppShell } from "./components/app-shell/AppShell";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/Home/HomePage";
import { CartPage, type CartLineItem } from "./pages/Cart/CartPage";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";
import ProductsPage from "./pages/Products/ProductsPage";
import SimilarProductsPage from "./pages/Products/SimilarProductsPage";
import ShopPage from "./pages/Shop/ShopPage";

function CartRoute({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: {
  items: CartLineItem[];
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}) {
  const navigate = useNavigate();

  const handleContinueShopping = () => navigate(-1);
  const handleCheckout = () => {
    console.log("Checkout clicked");
  };

  return (
    <CartPage
      items={items}
      onContinueShopping={handleContinueShopping}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
      onCheckout={handleCheckout}
    />
  );
}

function App() {
  const [items, setItems] = useState<CartLineItem[]>([]);

  const handleAddToCart = (
    product: CartLineItem["product"],
    selectedOptions: Record<string, string> = {},
    quantity: number = 1,
  ) => {
    setItems((current) => {
      const sameItem = current.find(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions),
      );

      if (sameItem) {
        return current.map((item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...current,
        {
          product,
          quantity,
          selectedOptions,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, nextQuantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, nextQuantity) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId: string) => {
    setItems((current) =>
      current.filter((item) => item.product.id !== productId),
    );
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell cartCount={cartCount}>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route
          path="/cart"
          element={
            <CartRoute
              items={items}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          }
        />
        <Route
          path="/products/:sourceItemId/similar"
          element={<SimilarProductsPage />}
        />
        <Route
          path="/products/:sourceItemId"
          element={<ProductDetailPage onAddToCart={handleAddToCart} />}
        />
        <Route path="/shop/:shopId" element={<ShopPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
