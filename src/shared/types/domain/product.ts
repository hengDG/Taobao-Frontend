export type LocalizedText = {
  en: string;
  km: string;
};

export type ProductOptionValue = {
  valueId: string;
  name: string;
  nameOriginal?: string | null;
  nameStatus?: "ready" | "pending";
  nameLang?: string | null;
};

export type ProductOption = {
  propId: string;
  name: string;
  nameOriginal?: string | null;
  nameStatus?: "ready" | "pending";
  nameLang?: string | null;
  values: ProductOptionValue[];
};

export type ProductSku = {
  skuId: string;
  mpSkuId?: string;
  selectionKey: string;
  selection: Record<string, string>;
  image?: string;

  priceRmbRaw: number;
  promotionPriceRmbRaw: number;
  couponPriceRmbRaw?: number;
  priceUsdCents?: number;
  priceKhr?: number;
  price?: {
    usd?: string | null;
    khr?: string | null;
  } | null;
  originalPrice?: {
    usd?: string | null;
    khr?: string | null;
  } | null;
  shippingCents?: number;

  quantity: number;
  available: boolean;
};

export type ProductCard = {
  id: string;
  section: LocalizedText;
  title: LocalizedText;
  shopName: LocalizedText;
  shopId?: string;
  priceText: string;
  imageUrl: string;
  productUrl: string;
  benefit?: LocalizedText;
  gallery?: string[];
  description?: string;
  categoryName?: string;
  available?: boolean;
  totalQuantity?: number;
  options?: ProductOption[];
  skus?: ProductSku[];
};
