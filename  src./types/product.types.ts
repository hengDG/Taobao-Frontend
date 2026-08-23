export type LocalizedText = {
  en: string;
  km: string;
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
};
