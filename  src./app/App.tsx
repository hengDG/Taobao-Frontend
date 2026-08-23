import { AppShell } from "@/components/layout/app-shell";
import { useCart } from "@/hooks/useCart";
import { AppRoutes } from "@/routes/AppRoutes";

export function App() {
  const {
    cartItems,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleCheckout,
  } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell cartCount={cartCount}>
      <AppRoutes
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />
    </AppShell>
  );
}

export default App;
