import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, ShoppingCart, Sparkles, Store } from "lucide-react";
import { animate, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getLocalizedText, useLanguage } from "@/contexts/LanguageContext";
import productService from "@/services/product/product.service";
import type {
  ProductCard as ProductCardType,
  //   ProductSku,
} from "@/shared/types";

import type {
  FlyState,
  ProductDetailLocationState,
  SelectedValues,
  ShopSummary,
} from "./productDetail.types";
import {
  buildOptionImageMap,
  findSelectedSku,
  findSkuByPrice,
  getDefaultSelection,
  getUniqueImages,
} from "./productDetail.utils";

type ProductDetailViewProps = {
  product: ProductCardType;
  onSelectProduct: (product: ProductCardType) => void;
  onAddToCart: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
    quantity?: number,
  ) => void;
};

export function ProductDetailView({
  product,
  onSelectProduct,
  onAddToCart,
}: ProductDetailViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const initialPriceFromQuery = new URLSearchParams(location.search).get(
    "initialPrice",
  );

  const initialPrice =
    (location.state as ProductDetailLocationState | null)?.initialPrice ??
    initialPriceFromQuery ??
    null;

  const productOptions = product.options ?? [];
  const skus = product.skus ?? [];
  const titleText = getLocalizedText(product.title, language);

  const gallery = useMemo(
    () => getUniqueImages(...(product.gallery ?? []), product.imageUrl),
    [product.gallery, product.imageUrl],
  );

  const initialSku = useMemo(
    () => findSkuByPrice(skus, initialPrice),
    [skus, initialPrice],
  );

  const defaultSelection = useMemo(
    () => getDefaultSelection(product, initialSku),
    [product, initialSku],
  );

  const [selectedValues, setSelectedValues] =
    useState<SelectedValues>(defaultSelection);
  const [selectedImage, setSelectedImage] = useState(
    gallery[0] ?? product.imageUrl,
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shopSummary, setShopSummary] = useState<ShopSummary | null>(null);
  const [flyState, setFlyState] = useState<FlyState | null>(null);

  const currentSku = useMemo(
    () => findSelectedSku(skus, selectedValues, initialSku),
    [skus, selectedValues, initialSku],
  );

  const optionImageMap = useMemo(() => buildOptionImageMap(skus), [skus]);

  const salePriceRmb = currentSku?.promotionPriceRmbRaw ?? 0;
  const originalPriceRmb = currentSku?.priceRmbRaw ?? salePriceRmb;

  const discountPercent =
    originalPriceRmb > 0 && salePriceRmb > 0 && originalPriceRmb > salePriceRmb
      ? Math.round(((originalPriceRmb - salePriceRmb) / originalPriceRmb) * 100)
      : 0;

  const usdPrice =
    currentSku?.price?.usd ??
    (currentSku?.priceUsdCents
      ? `$${(currentSku.priceUsdCents / 100).toFixed(2)}`
      : "$0.00");

  const khrPrice =
    currentSku?.price?.khr ??
    (currentSku?.priceKhr
      ? `៛${new Intl.NumberFormat("en-US").format(currentSku.priceKhr)}`
      : "៛0");

  const originalUsdPrice = currentSku?.originalPrice?.usd ?? usdPrice;

  useEffect(() => {
    setSelectedValues(defaultSelection);
    setQuantity(1);
    setSelectedImage(gallery[0] ?? product.imageUrl);
  }, [product.id, defaultSelection, gallery, product.imageUrl]);

  useEffect(() => {
    if (currentSku?.image) {
      setSelectedImage(currentSku.image);
      return;
    }

    const selectedOptionImage = productOptions
      .map((option) => {
        const valueId = selectedValues[option.propId];

        if (!valueId) {
          return null;
        }

        return optionImageMap.get(`${option.propId}:${valueId}`) ?? null;
      })
      .find(Boolean);

    if (selectedOptionImage) {
      setSelectedImage(selectedOptionImage);
    }
  }, [currentSku, selectedValues, productOptions, optionImageMap]);

  useEffect(() => {
    if (!product.shopId) {
      setShopSummary(null);
      return;
    }

    let active = true;

    const loadShop = async () => {
      try {
        const response = await productService.getShopProducts(
          product.shopId!,
          12,
        );

        if (!active) return;

        setShopSummary({
          name: response.shop?.name ?? product.shopName.en ?? "Shop",
          rating: response.shop?.rating ?? 0,
          shippingOrigin: response.shop?.shippingOrigin ?? "",
          totalProducts: response.items?.length ?? 0,
        });
      } catch {
        if (active) {
          setShopSummary(null);
        }
      }
    };

    void loadShop();

    return () => {
      active = false;
    };
  }, [product.shopId, product.shopName.en]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [product.id]);

  const missingOptions = productOptions
    .filter((option) => !selectedValues[option.propId])
    .map((option) => option.name);

  const selectedOptions = useMemo(
    () =>
      productOptions.reduce<Record<string, string>>((result, option) => {
        const selectedId = selectedValues[option.propId];
        const selected = option.values.find(
          (value) => value.valueId === selectedId,
        );

        if (selected) {
          result[option.name] = selected.name;
        }

        return result;
      }, {}),
    [productOptions, selectedValues],
  );

  const handleOptionClick = (propId: string, valueId: string) => {
    setSelectedValues((previous) => {
      if (previous[propId] === valueId) {
        const next = { ...previous };
        delete next[propId];
        return next;
      }

      return {
        ...previous,
        [propId]: valueId,
      };
    });
  };

  const validateOptions = (action: string) => {
    if (!missingOptions.length) {
      return true;
    }

    toast.error("Please select an option", {
      description: `Choose ${missingOptions.join(", ")} before ${action}.`,
    });

    return false;
  };

  const triggerFlyToCart = () => {
    const target = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cart-target='true']"),
    ).find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (!target) {
      return;
    }

    const sourceRect = {
      left: Math.min(
        window.innerWidth - 200,
        Math.max(80, window.innerWidth * 0.7),
      ),
      top: Math.min(
        window.innerHeight - 130,
        Math.max(80, window.innerHeight * 0.35),
      ),
      width: 220,
      height: 110,
    };

    const targetRect = target.getBoundingClientRect();
    const width = sourceRect.width;
    const height = sourceRect.height;
    const startX = sourceRect.left;
    const startY = sourceRect.top;
    const endX = targetRect.left + targetRect.width / 2 - width / 2;
    const endY = targetRect.top + targetRect.height / 2 - height / 2;

    setFlyState({
      startX,
      startY,
      deltaX: endX - startX,
      deltaY: endY - startY,
      width,
      height,
      imageSrc: selectedImage || product.imageUrl,
      title: titleText,
      quantity,
    });
  };

  const handleAddToCart = () => {
    if (!validateOptions("adding to cart")) {
      return;
    }

    if (!currentSku) {
      toast.error("Selected product option is unavailable.");
      return;
    }

    triggerFlyToCart();

    const cartProduct: ProductCardType = {
      ...product,
      priceText: currentSku.price?.usd ?? product.priceText,
      imageUrl: currentSku.image || product.imageUrl,
    };

    window.setTimeout(() => {
      onAddToCart(cartProduct, selectedOptions, quantity);
    }, 420);
  };

  const handleBuyNow = () => {
    if (!validateOptions("continuing")) {
      return;
    }

    onSelectProduct(product);
  };

  return (
    <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-0">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] md:items-start">
        <div
          ref={contentRef}
          className="space-y-5 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {shopSummary && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 font-bold text-orange-500 rounded-xl bg-orange-50">
                  {shopSummary.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      product.shopId && navigate(`/shop/${product.shopId}`)
                    }
                    className="font-semibold text-slate-800 hover:text-[#ff6a00]"
                  >
                    {shopSummary.name}
                  </button>

                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                      {shopSummary.rating
                        ? `${shopSummary.rating} rating`
                        : "New seller"}
                    </span>

                    {shopSummary.shippingOrigin && (
                      <span>{shopSummary.shippingOrigin}</span>
                    )}

                    <span>{shopSummary.totalProducts} items</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  product.shopId && navigate(`/shop/${product.shopId}`)
                }
                className="px-3 py-2 text-xs font-medium border rounded-lg border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              >
                View Store
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 px-2 sm:flex-row sm:px-4">
            <div className="flex flex-row w-full gap-3 overflow-x-auto shrink-0 sm:w-18 sm:flex-col sm:overflow-visible">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onMouseEnter={() => setSelectedImage(image)}
                  onFocus={() => setSelectedImage(image)}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-lg border-2 bg-slate-100 transition ${
                    selectedImage === image
                      ? "border-[#ff6a00]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${titleText} ${index + 1}`}
                    className="object-cover w-full h-16 sm:h-20"
                  />
                </button>
              ))}
            </div>

            <div
              ref={imageRef}
              className="mx-auto flex w-full max-w-[520px] flex-1 items-center justify-center overflow-hidden rounded-[15px]"
            >
              <img
                src={selectedImage || product.imageUrl}
                alt={titleText}
                className="block max-h-[520px] w-full object-contain"
              />
            </div>
          </div>

          {product.description && (
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <div
                className="product-description mx-auto max-w-[750px] overflow-hidden [&_img]:mx-auto [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:max-w-full [&_img]:rounded-xl"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col pt-2 md:sticky md:top-6 md:max-h-[calc(100vh-5rem)]">
          <div className="pb-3 bg-white border-b shrink-0 border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Store className="h-3.5 w-3.5" />

              <button
                type="button"
                onClick={() =>
                  product.shopId && navigate(`/shop/${product.shopId}`)
                }
                className="font-medium text-slate-600 hover:text-[#ff6a00]"
              >
                {product.shopName.en}
              </button>
            </div>

            <h1 className="mt-3 text-xl font-bold leading-[1.32] text-slate-900">
              {/* {titleText} */}
              {titleText ? titleText : "No title available"}
            </h1>

            <div className="relative mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#c00021] to-[#ff002b] px-4 py-3 shadow-md">
              <div className="text-xs font-medium line-through text-white/60">
                {originalUsdPrice}
              </div>

              {discountPercent > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-4xl font-black text-[#ffee32]">
                  -{discountPercent}%
                </span>
              )}

              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">{usdPrice}</p>
                <span className="text-sm font-semibold text-white/80">
                  {khrPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
            {productOptions.map((option) => (
              <div key={option.propId} className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  {option.name}

                  {!selectedValues[option.propId] && (
                    <span className="ml-1 text-xs font-normal text-red-500">
                      (required)
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const key = `${option.propId}:${value.valueId}`;
                    const image = optionImageMap.get(key);
                    const selected =
                      selectedValues[option.propId] === value.valueId;

                    return (
                      <button
                        key={value.valueId}
                        type="button"
                        onClick={() =>
                          handleOptionClick(option.propId, value.valueId)
                        }
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1 text-sm transition ${
                          selected
                            ? "border-[#ff6a00] bg-[#fff5ee] text-[#ff6a00]"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {image && (
                          <img
                            src={image}
                            alt={value.name}
                            className="object-cover rounded-sm h-7 w-7"
                          />
                        )}
                        <span>{value.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="space-y-2 mb-15">
              <p className="text-sm font-semibold text-slate-800">Quantity</p>

              <div className="flex items-center px-2 border rounded-full w-fit border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="w-10 h-10 text-xl"
                >
                  −
                </button>

                <span className="w-10 text-sm font-semibold text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(currentSku?.quantity ?? 99, value + 1),
                    )
                  }
                  className="w-10 h-10 text-xl"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 py-3 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#ff5a00] px-4 py-3 text-sm font-semibold text-white sm:flex-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-full border border-[#ffb17a] bg-[#fff7f2] px-4 py-3 text-sm font-semibold text-[#d85b00] sm:w-auto"
              >
                <Sparkles className="w-4 h-4" />
                Buy now
              </button>

              <button
                type="button"
                onClick={() => setIsFavorite((value) => !value)}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                  isFavorite
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {flyState ? (
        <motion.div
          initial={{
            x: flyState.startX,
            y: flyState.startY,
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: [
              flyState.startX,
              flyState.startX + flyState.deltaX * 0.15,
              flyState.startX + flyState.deltaX * 0.95,
              flyState.startX + flyState.deltaX,
            ],
            y: [
              flyState.startY,
              flyState.startY - 80,
              flyState.startY + flyState.deltaY * 0.9,
              flyState.startY + flyState.deltaY,
            ],
            scale: [1, 0.95, 0.35, 0.15],
            opacity: [1, 1, 0.8, 1],
            rotate: [0, -8, 12, 20],
          }}
          transition={{
            duration: 1,
            times: [0, 0.25, 0.5, 1],
            ease: [0.16, 0.5, 0.2, 1],
          }}
          onAnimationComplete={() => {
            const cartTarget = document.querySelector(
              "[data-cart-target='true']",
            );

            const cartIcon = cartTarget?.querySelector(
              "[data-cart-icon='true']",
            );

            if (cartIcon) {
              animate(
                cartIcon,
                {
                  scale: [1, 1.4, 0.9, 1],
                  rotate: [0, -15, 15, 0],
                },
                {
                  duration: 0.45,
                  ease: "easeOut",
                },
              );
            }

            setFlyState(null);
          }}
          className="pointer-events-none fixed left-0 top-0 z-[80] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          style={{
            width: flyState.width,
            height: flyState.height,
          }}
        >
          <div className="flex items-center w-full h-full gap-3 p-3">
            <div className="relative h-full w-[34%] shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <motion.img
                src={flyState.imageSrc}
                alt={flyState.title}
                className="object-cover w-full h-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold line-clamp-2 text-slate-700">
                {flyState.title}
              </p>

              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#ff5000]">
                    {usdPrice}
                  </span>

                  {khrPrice && (
                    <span className="text-[10px] font-medium text-slate-500">
                      {khrPrice}
                    </span>
                  )}
                </div>

                <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-500">
                  x{flyState.quantity}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
