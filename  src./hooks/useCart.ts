import { useCallback, useState } from "react";
import type { ProductCard as ProductCardType } from "@/types/product";
import {
  addItemToCart,
  removeCartItem,
  updateCartQuantity,
  type CartLineItem,
} from "@/stores/cart.store";

const defaultSelectedOptions: Record<string, string> = {
  bundle: "1 pc",
  capacity: "0.8L",
  color: "Classic",
};

export function useCart() {
  const [cartItems, setCartItems] = useState<CartLineItem[]>([]);

  const handleAddToCart = useCallback(
    (
      product: ProductCardType,
      selectedOptions: Record<string, string> = defaultSelectedOptions,
    ) => {
      setCartItems((current) =>
        addItemToCart(current, product, selectedOptions),
      );
    },
    [],
  );

  const handleUpdateCartQuantity = useCallback(
    (productId: string, nextQuantity: number) => {
      setCartItems((current) =>
        updateCartQuantity(current, productId, nextQuantity),
      );
    },
    [],
  );

  const handleRemoveCartItem = useCallback((productId: string) => {
    setCartItems((current) => removeCartItem(current, productId));
  }, []);

  const handleCheckout = useCallback(() => {
    setCartItems([]);
  }, []);

  return {
    cartItems,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleCheckout,
  };
}
