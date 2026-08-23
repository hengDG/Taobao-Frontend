import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import type { ProductCard as ProductCardType } from "@/types/product";

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

export function ProductDetailView({
  product,
  gallery,
  onBack,
  onSelectProduct,
  onAddToCart,
}: {
  product: ProductCardType;
  gallery: string[];
  onBack: () => void;
  onSelectProduct: (product: ProductCardType) => void;
  onAddToCart: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
  ) => void;
}) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const galleryList = useMemo(
    () => (product.gallery?.length ? product.gallery : gallery).filter(Boolean),
    [gallery, product.gallery],
  );
  const [selectedImage, setSelectedImage] = useState(
    galleryList[0] ?? product.imageUrl,
  );
  const [quantity, setQuantity] = useState(1);
  const [flyState, setFlyState] = useState<{
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
    width: number;
    height: number;
    imageSrc: string;
    title: string;
    quantity: number;
  } | null>(null);

  const colorOption = product.options?.find((option) =>
    /color|颜色/i.test(option.name),
  );
  const sizeOption = product.options?.find((option) =>
    /size|尺码/i.test(option.name),
  );

  const defaultSelectedColor = colorOption?.values[0]?.name ?? "Default";
  const defaultSelectedSize = sizeOption?.values[0]?.name ?? "Default";
  const [selectedColor, setSelectedColor] = useState(defaultSelectedColor);
  const [selectedSize, setSelectedSize] = useState(defaultSelectedSize);

  useEffect(() => {
    const nextImage = galleryList[0] ?? product.imageUrl;
    setSelectedImage(nextImage);
    setSelectedColor(defaultSelectedColor);
    setSelectedSize(defaultSelectedSize);
    setQuantity(1);
  }, [
    defaultSelectedColor,
    defaultSelectedSize,
    galleryList,
    product.id,
    product.imageUrl,
  ]);

  const currentSku = useMemo(() => {
    const skuList = product.skus ?? [];

    if (!skuList.length) {
      return null;
    }

    const colorValueId = colorOption?.values.find(
      (value) => value.name === selectedColor,
    )?.valueId;
    const sizeValueId = sizeOption?.values.find(
      (value) => value.name === selectedSize,
    )?.valueId;

    const matchSku = skuList.find((sku) => {
      if (!sku.selection) return false;

      const matchesColor =
        !colorValueId ||
        sku.selection[colorOption?.propId ?? ""] === colorValueId;
      const matchesSize =
        !sizeValueId || sku.selection[sizeOption?.propId ?? ""] === sizeValueId;

      return matchesColor && matchesSize;
    });

    return (
      matchSku ??
      skuList.find((sku) => sku.available && sku.quantity > 0) ??
      skuList[0]
    );
  }, [colorOption, product.skus, selectedColor, selectedSize, sizeOption]);

  const salePrice = currentSku?.promotionPriceRmbRaw ?? 0;
  const listPrice = currentSku?.priceRmbRaw ?? salePrice;
  const discountPercent =
    listPrice > 0 && salePrice > 0
      ? Math.max(1, Math.round(((listPrice - salePrice) / listPrice) * 100))
      : 0;

  const triggerFlyToCart = () => {
    const source = imageRef.current;
    const target = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cart-target='true']"),
    ).find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (!source || !target) {
      return;
    }

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const flyerWidth = Math.max(220, Math.min(320, sourceRect.width * 0.6));
    const flyerHeight = Math.max(96, Math.min(132, flyerWidth * 0.5));
    const startX = sourceRect.left + sourceRect.width / 2 - flyerWidth / 2;
    const startY = sourceRect.top + sourceRect.height / 2 - flyerHeight / 2;
    const endX = targetRect.left + targetRect.width / 2 - flyerWidth / 2;
    const endY = targetRect.top + targetRect.height / 2 - flyerHeight / 2;

    setFlyState({
      startX,
      startY,
      deltaX: endX - startX,
      deltaY: endY - startY,
      width: flyerWidth,
      height: flyerHeight,
      imageSrc: selectedImage || product.imageUrl,
      title: product.title.en,
      quantity,
    });
  };

  const handleAddToCart = () => {
    triggerFlyToCart();
    window.setTimeout(() => {
      onAddToCart(product);
    }, 420);
  };

  const thumbnails = Array.from(
    new Set([...galleryList, product.imageUrl].filter(Boolean)),
  );

  return (
    <div className="mx-auto max-w-8xl px-10 py-6">
      <button
        type="button"
        className="mb-6 text-sm font-medium text-slate-700"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] md:items-start">
        <div className="space-y-5 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto md:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex w-20 flex-col gap-3">
                {thumbnails.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`View ${product.title.en} image ${index + 1}`}
                    onMouseEnter={() => setSelectedImage(image)}
                    onFocus={() => setSelectedImage(image)}
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-xl border-2 bg-slate-100 transition ${
                      selectedImage === image
                        ? "border-[#ff6a00]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title.en} view ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div
                ref={imageRef}
                className="flex-1 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50"
              >
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.title.en}
                  className="h-[520px] w-full object-cover"
                />
              </div>
            </div>
          </div>

          {product.description ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <div
                className="product-description prose max-w-none [&_img]:mx-auto [&_img]:block [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 [&_div]:w-full [&_div]:max-w-full"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-5 pt-2 md:sticky md:top-6 md:self-start">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-[#f2f5f9] px-2 py-1">
              {product.categoryName ?? product.section.en}
            </span>
            <span>•</span>
            <span>{product.shopName.en}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-[2rem] font-bold leading-[1.12] text-slate-900">
              {product.title.en}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-[#fff0e6] px-2 py-1 font-semibold text-[#ff6a00]">
                {product.benefit?.en ?? "Best seller"}
              </span>
              <span className="rounded-full bg-[#f3f7ff] px-2 py-1 text-[#194891]">
                {product.available === false ? "Out of stock" : "In stock"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#fff8f4] p-4 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 line-through">
                {formatCurrency(listPrice)}
              </span>
              {discountPercent > 0 ? (
                <span className="rounded-full bg-[#ffefe7] px-2 py-1 text-[11px] font-semibold text-[#ff6a00]">
                  {discountPercent}% off
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-4xl font-extrabold tracking-tight text-[#ff5000]">
                {formatCurrency(salePrice || listPrice)}
              </p>
              <span className="mb-1 text-sm text-slate-500">
                {product.totalQuantity
                  ? `${product.totalQuantity} items`
                  : "Ready to ship"}
              </span>
            </div>
          </div>

          {colorOption ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                {colorOption.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {colorOption.values.map((value) => (
                  <button
                    key={value.valueId}
                    type="button"
                    onClick={() => setSelectedColor(value.name)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      selectedColor === value.name
                        ? "border-[#ff6a00] bg-[#fff5ee] text-[#ff6a00]"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {sizeOption ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                {sizeOption.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOption.values.map((value) => (
                  <button
                    key={value.valueId}
                    type="button"
                    onClick={() => setSelectedSize(value.name)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      selectedSize === value.name
                        ? "border-[#ff6a00] bg-[#fff5ee] text-[#ff6a00]"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Quantity</p>
            <div className="flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-2">
              <button
                type="button"
                onClick={() => setQuantity((next) => Math.max(1, next - 1))}
                className="h-10 w-10 text-xl text-slate-600"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((next) =>
                    Math.min(currentSku?.quantity ?? 99, next + 1),
                  )
                }
                className="h-10 w-10 text-xl text-slate-600"
              >
                ＋
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 rounded-full bg-[#ff6a00] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_28px_rgba(255,106,0,0.25)] transition hover:bg-[#e85f00]"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => onSelectProduct(product)}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {flyState ? (
        <motion.div
          initial={{
            x: flyState.startX,
            y: flyState.startY,
            scale: 1,
            opacity: 0.95,
            rotate: 0,
          }}
          animate={{
            x: flyState.startX + flyState.deltaX,
            y: flyState.startY + flyState.deltaY,
            scale: 0.2,
            opacity: 0.18,
            rotate: 10,
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            const target = Array.from(
              document.querySelectorAll<HTMLElement>(
                "[data-cart-target='true']",
              ),
            ).find((element) => {
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            });

            if (target) {
              const cartIcon = target.querySelector<HTMLElement>(
                "[data-cart-icon='true']",
              );
              const cartFlash = target.querySelector<HTMLElement>(
                "[data-cart-flash='true']",
              );

              if (cartIcon) {
                animate(
                  cartIcon,
                  {
                    scale: [1, 1.35, 0.9, 1.12, 1],
                    rotate: [0, -8, 8, -4, 0],
                  },
                  { duration: 0.5, ease: "easeOut" },
                );
              }

              if (cartFlash) {
                animate(
                  cartFlash,
                  {
                    opacity: [0, 0.35, 0],
                    scale: [0.8, 1.1, 1],
                  },
                  { duration: 0.45, ease: "easeOut" },
                );
              }
            }

            setFlyState(null);
          }}
          className="pointer-events-none fixed left-0 top-0 z-[80] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.25)]"
          style={{ width: flyState.width, height: flyState.height }}
        >
          <div className="flex h-full w-full items-center gap-3 p-3">
            <div className="relative h-full w-[34%] shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <img
                src={flyState.imageSrc}
                alt={flyState.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="w-[66%] flex-1">
              <p className="line-clamp-2 text-xs font-semibold text-slate-700">
                {flyState.title}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#ff5000]">
                  {formatCurrency(salePrice || listPrice)}
                </span>
                <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-500">
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
