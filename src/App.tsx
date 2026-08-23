import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { AppShell } from "./components/app-shell/AppShell";
import HomePage from "./pages/Home/HomePage";
import { CartPage, type CartLineItem } from "./pages/Cart/CartPage";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";

function CartRoute() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartLineItem[]>([]);

  const handleContinueShopping = () => navigate("/");
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
  const handleCheckout = () => {
    console.log("Checkout clicked");
  };

  return (
    <CartPage
      items={items}
      onContinueShopping={handleContinueShopping}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
}

function App() {
  return (
    <AppShell cartCount={3}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartRoute />} />
        <Route path="/products/:sourceItemId" element={<ProductDetailPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
