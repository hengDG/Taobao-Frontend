import type {
  ProductCard as ProductCardType,
  ProductSku,
} from "@/shared/types";

const formatCny = (cents: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);

const parsePrice = (value?: string | null) => {
  if (!value) return null;

  const parsed = Number(value.replace(/[^\d.]/g, ""));

  return Number.isFinite(parsed) ? parsed : null;
};

export const getUniqueImages = (...images: Array<string | undefined | null>) =>
  Array.from(new Set(images.filter(Boolean))) as string[];

export const findSkuByPrice = (
  skus: ProductSku[] = [],
  price?: string | null,
): ProductSku | null => {
  const targetPrice = parsePrice(price);

  if (targetPrice === null) return null;

  return (
    skus.find((sku) => {
      const skuPrice = parsePrice(sku.price?.usd);

      return skuPrice !== null && Math.abs(skuPrice - targetPrice) < 0.001;
    }) ?? null
  );
};

export const getDefaultSelection = (
  product: ProductCardType,
  initialSku: ProductSku | null,
): Record<string, string> => {
  if (initialSku?.selection) {
    return { ...initialSku.selection };
  }

  return (product.options ?? []).reduce<Record<string, string>>(
    (selection, option) => {
      if (option.values.length === 1) {
        selection[option.propId] = option.values[0].valueId;
      }

      return selection;
    },
    {},
  );
};

export const findSelectedSku = (
  skus: ProductSku[] = [],
  selectedValues: Record<string, string>,
  fallbackSku: ProductSku | null,
) => {
  if (!skus.length) return null;

  const selectedEntries = Object.entries(selectedValues);

  if (!selectedEntries.length) {
    return (
      fallbackSku ??
      skus.find((sku) => sku.available && sku.quantity > 0) ??
      skus[0]
    );
  }

  return (
    skus.find((sku) =>
      selectedEntries.every(
        ([propId, valueId]) =>
          String(sku.selection?.[propId]) === String(valueId),
      ),
    ) ??
    fallbackSku ??
    null
  );
};

export const buildOptionImageMap = (skus: ProductSku[] = []) => {
  const map = new Map<string, string>();

  skus.forEach((sku) => {
    const image = sku.image;

    if (!image) return;

    Object.entries(sku.selection ?? {}).forEach(([propId, valueId]) => {
      if (!propId || !valueId) return;

      const key = `${propId}:${valueId}`;

      if (!map.has(key)) {
        map.set(key, image);
      }
    });
  });

  return map;
};

const resolveLocalizedName = (
  value:
    | {
        name?: string | null;
        nameOriginal?: string | null;
        nameStatus?: "ready" | "pending" | null;
        nameLang?: string | null;
      }
    | null
    | undefined,
  language: "en" | "km",
  fallback: string,
) => {
  const translated = typeof value?.name === "string" ? value.name.trim() : "";

  if (value?.nameStatus === "ready" && translated) {
    return translated;
  }

  if (translated && (value?.nameLang === language || !value?.nameLang)) {
    return translated;
  }

  const original =
    typeof value?.nameOriginal === "string" ? value.nameOriginal.trim() : "";

  return original || translated || fallback;
};

export const applyProductDetailTranslations = (
  product: ProductCardType,
  translations: Record<string, string>,
  language: "en" | "km",
): ProductCardType => {
  if (!product.options?.length) {
    return product;
  }

  return {
    ...product,
    options: product.options.map((option) => {
      const optionSource = option.nameOriginal || option.name;
      const optionTranslation = optionSource
        ? translations[optionSource]
        : undefined;

      return {
        ...option,
        name:
          optionTranslation ??
          (option.nameStatus === "pending"
            ? (option.nameOriginal ?? option.name)
            : option.name),
        nameLang: optionTranslation ? language : (option.nameLang ?? null),
        nameStatus: optionTranslation
          ? "ready"
          : (option.nameStatus ?? "ready"),
        values: option.values.map((value) => {
          const valueSource = value.nameOriginal || value.name;
          const valueTranslation = valueSource
            ? translations[valueSource]
            : undefined;

          return {
            ...value,
            name:
              valueTranslation ??
              (value.nameStatus === "pending"
                ? (value.nameOriginal ?? value.name)
                : value.name),
            nameLang: valueTranslation ? language : (value.nameLang ?? null),
            nameStatus: valueTranslation
              ? "ready"
              : (value.nameStatus ?? "ready"),
          };
        }),
      };
    }),
  };
};

export const normalizeProductDetailData = (
  data: any,
  fallbackId: string,
  language: "en" | "km" = "en",
): ProductCardType => {
  const images = getUniqueImages(
    ...(Array.isArray(data?.images) ? data.images : []),
    data?.image,
    ...(Array.isArray(data?.gallery) ? data.gallery : []),
  );

  const skus: ProductSku[] = (data?.skus ?? []).map(
    (sku: any): ProductSku => ({
      skuId: String(sku?.skuId ?? ""),
      mpSkuId: String(sku?.mpSkuId ?? ""),
      selectionKey: String(sku?.selectionKey ?? ""),
      selection: sku?.selection ?? {},
      image: String(sku?.image ?? ""),
      priceRmbRaw: Number(sku?.priceRmbRaw ?? 0),
      promotionPriceRmbRaw: Number(
        sku?.promotionPriceRmbRaw ?? sku?.priceRmbRaw ?? 0,
      ),
      couponPriceRmbRaw: Number(sku?.couponPriceRmbRaw ?? 0),
      priceUsdCents: Number(sku?.priceUsdCents ?? 0),
      priceKhr: Number(sku?.priceKhr ?? 0),
      price: sku?.price ?? null,
      originalPrice: sku?.originalPrice ?? null,
      shippingCents: Number(sku?.shippingCents ?? 0),
      quantity: Number(sku?.quantity ?? 0),
      available: sku?.available ?? true,
    }),
  );

  const firstSku =
    skus.find((sku) => sku.available && sku.quantity > 0) ?? skus[0] ?? null;

  const primaryImage = data?.image ?? images[0] ?? firstSku?.image ?? "";

  const rawTitle = typeof data?.title === "string" ? data.title.trim() : "";
  //   const originalTitle =
  //     typeof data?.titleOriginal === "string" ? data.titleOriginal.trim() : "";

  const titleNeedsCurrentLanguage =
    !rawTitle ||
    data?.titleStatus === "pending" ||
    data?.titleLang !== language;

  const localizedTitle = rawTitle && !titleNeedsCurrentLanguage ? rawTitle : "";

  return {
    id: String(data?.itemId ?? fallbackId),
    section: {
      en: data?.category?.name ?? data?.categoryName ?? "Products",
      km: data?.category?.name ?? data?.categoryName ?? "Products",
    },
    title: {
      en: language === "en" ? localizedTitle : "",
      km: language === "km" ? localizedTitle : "",
    },
    shopName: {
      en: data?.shop?.name ?? data?.shopName ?? "E-Taobao",
      km: data?.shop?.name ?? data?.shopName ?? "E-Taobao",
    },
    shopId: data?.shop?.id ?? data?.shopId ?? undefined,
    priceText: formatCny(
      firstSku?.promotionPriceRmbRaw ?? firstSku?.priceRmbRaw ?? 0,
    ),
    imageUrl: primaryImage,
    productUrl: "",
    benefit: {
      en: data?.available === false ? "Out of stock" : "Best seller",
      km: data?.available === false ? "Out of stock" : "Best seller",
    },
    gallery: images.length ? images : primaryImage ? [primaryImage] : [],
    description: data?.description ?? "",
    categoryName: data?.category?.name ?? data?.categoryName ?? "Products",
    available: data?.available ?? true,
    totalQuantity: Number(data?.totalQuantity ?? 0),
    options: (data?.options ?? []).map((option: any) => ({
      propId: String(option?.propId ?? ""),
      name: resolveLocalizedName(option, language, "Option"),
      nameOriginal: option?.nameOriginal ?? option?.name ?? null,
      nameStatus: option?.nameStatus ?? "ready",
      nameLang: option?.nameLang ?? null,
      values: (option?.values ?? []).map((value: any) => ({
        valueId: String(value?.valueId ?? ""),
        name: resolveLocalizedName(value, language, "Variant"),
        nameOriginal: value?.nameOriginal ?? value?.name ?? null,
        nameStatus: value?.nameStatus ?? "ready",
        nameLang: value?.nameLang ?? null,
      })),
    })),
    skus,
  };
};

export { formatCny, parsePrice };
