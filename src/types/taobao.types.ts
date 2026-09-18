export type TitleStatus = "ready" | "pending";

export type TaobaoProduct = {
  source?: string;
  itemId?: string;
  sourceItemId?: string;
  supplyProductId?: string | null;
  title?: string | null;
  titleOriginal?: string | null;
  titleLang?: string | null;
  titleStatus?: TitleStatus;
  image?: string;
  images?: string[];
  categoryName?: string;
  themeLabel?: string;
  soldLabel?: string;
  shopName?: string | null;
  shopRating?: number | null;
  shippingOrigin?: string | null;
  couponCents?: number | null;
  listCents?: number | null;
  priceCents?: number | null;
  priceUsdCents?: number | null;
  priceKhr?: number | null;
  originalPrice?:
    | {
        usd?: string | null;
        khr?: string | null;
      }
    | number
    | null;
  price?: {
    usd?: string | null;
    khr?: string | null;
  } | null;
  description?: string;
  inStock?: boolean;
};

export type TaobaoExactProduct = {
  itemId?: string;
  source?: string;
  sourceItemId?: string;
  supplyProductId?: string | null;
  title?: string | null;
  titleOriginal?: string | null;
  titleLang?: string | null;
  titleStatus?: TitleStatus;
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

export type CategoryChild = {
  themeId?: string;
  label?: string;
  flag?: string | null;
  productsUrl?: string;
};

export type CategoryGroup = {
  label?: string;
  children?: CategoryChild[];
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
  nextScrollId?: string | null;
  shopName?: string | null;
  shopId?: string | null;
  shop?: {
    id?: string;
    name?: string;
    rating?: number | null;
    shippingOrigin?: string | null;
  };
};
