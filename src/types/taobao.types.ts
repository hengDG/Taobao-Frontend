export type TaobaoProduct = {
  sourceItemId?: string;
  title?: string;
  titleOriginal?: string;
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
};
