import type { ProductCard } from "@/types/product.types";

export type CartItem = {
  product: ProductCard;
  quantity: number;
  selectedOptions: Record<string, string>;
};
