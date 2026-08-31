export type TaobaoProduct = {
  source?: string;
  itemId?: string;
  sourceItemId?: string;
  supplyProductId?: string | null;
  title?: string;
  titleOriginal?: string;
  image?: string;
  images?: string[];
  categoryName?: string;
  soldLabel?: string;
  shopName?: string | null;
  shopRating?: number | null;
  shippingOrigin?: string | null;
  couponCents?: number | null;
  listCents?: number | null;
  priceCents?: number | null;
  description?: string;
  inStock?: boolean;
};

export type TaobaoExactProduct = {
  itemId?: string;
  source?: string;
  sourceItemId?: string;
  supplyProductId?: string | null;
  title?: string;
  titleOriginal?: string;
  image?: string;
  shopName?: string | null;
  shopRating?: number | null;
  shippingOrigin?: string | null;
  listCents?: number | null;
  couponCents?: number | null;
  inStock?: boolean;
};

export type ByLinkProductResponse = {
  itemId?: string;
  exact?: TaobaoExactProduct;
  detailUrl?: string;
  similar?: TaobaoProduct[];
};

export type ExploreProductsResponse = {
  products?: TaobaoProduct[];
  nextCursor?: string | null;
  hasMore?: boolean;
};

export type TaobaoProductDetailResponse = TaobaoProduct;

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
  total?: number;
  page?: number;
  size?: number;
  keyword?: string;
  itemId?: string;
  exact?: TaobaoExactProduct;
  detailUrl?: string;
  similar?: TaobaoProduct[];
};
