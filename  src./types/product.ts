export type LocalizedText = {
  en: string;
  km: string;
};

export type ProductOptionValue = {
  valueId: string;
  name: string;
};

export type ProductOption = {
  propId: string;
  name: string;
  values: ProductOptionValue[];
};

export type ProductSku = {
  skuId: string;
  selectionKey: string;

  priceRmbRaw: number;
  promotionPriceRmbRaw: number;

  quantity: number;
  available: boolean;

  selection: Record<string, string>;
};

export type ProductCard = {
  id: string;

  section: LocalizedText;
  title: LocalizedText;
  shopName: LocalizedText;

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

export type ThemeProductItem = {
  source: string;

  sourceItemId: string;

  supplyProductId: string | null;

  title: string;

  image: string;

  categoryName: string;
  categoryId: string;

  listCents: number;

  couponCents: number | null;

  soldLabel: string;
};

export type ThemeProductsResponse = {
  items: ThemeProductItem[];

  nextScrollId?: string | null;
};

export type TaobaoProduct = {
  sourceItemId?: string;

  title?: string;

  image?: string;

  images?: string[];

  categoryName?: string;

  soldLabel?: string;

  couponCents?: number | null;

  listCents?: number | null;

  priceCents?: number | null;

  shopName?: string;

  description?: string;
};

export type TaobaoProductDetailResponse =
  TaobaoProduct;

export type TaobaoHomeRow = {
  themeId?: string;

  label?: string;

  order?: number;

  items?: TaobaoProduct[];

  seeAllUrl?: string;
};

export type TaobaoHomeResponse = {
  rows?: TaobaoHomeRow[];
};

export type TaobaoProductsResponse = {
  items?: TaobaoProduct[];
};