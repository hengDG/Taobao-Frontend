import type { ProductCard } from "@/types/product";

export type CartLineItem = {
  product: ProductCard;
  quantity: number;
  selectedOptions: Record<string, string>;
  selectedForCheckout?: boolean;
};

export function addItemToCart(
  items: CartLineItem[],
  product: ProductCard,
  selectedOptions: Record<string, string> = {
    bundle: "1 pc",
    capacity: "0.8L",
    color: "Classic",
  },
) {
  const key = JSON.stringify(selectedOptions);
  const existing = items.find(
    (item) =>
      item.product.id === product.id &&
      JSON.stringify(item.selectedOptions) === key,
  );

  if (existing) {
    return items.map((item) =>
      item.product.id === product.id &&
      JSON.stringify(item.selectedOptions) === key
        ? { ...item, quantity: item.quantity + 1, selectedForCheckout: true }
        : item,
    );
  }

  return [
    ...items,
    {
      product,
      quantity: 1,
      selectedOptions,
      selectedForCheckout: true,
    },
  ];
}

export function updateCartQuantity(
  items: CartLineItem[],
  productId: string,
  nextQuantity: number,
) {
  return items
    .map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity: Math.max(1, nextQuantity),
            selectedForCheckout: item.selectedForCheckout ?? true,
          }
        : item,
    )
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(items: CartLineItem[], productId: string) {
  return items.filter((item) => item.product.id !== productId);
}
