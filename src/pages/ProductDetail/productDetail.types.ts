export type SelectedValues = Record<string, string>;

export type ProductDetailLocationState = {
  initialPrice?: string;
};

export type ShopSummary = {
  name: string;
  rating: number;
  shippingOrigin: string;
  totalProducts: number;
};

export type FlyState = {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  width: number;
  height: number;
  imageSrc: string;
  title: string;
  quantity: number;
};
