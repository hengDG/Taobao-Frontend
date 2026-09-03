import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, ShoppingCart, Sparkles, Store } from "lucide-react";
import { animate, motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ProductDetailSkeleton } from "@/components/ui/ProductSkeleton";
import type { ProductCard as ProductCardType } from "@/types/product";
import productService from "@/services/product/product.service";
import ExploreProduct from "@/components/product/ExploreProduct";

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

function ProductDetailView({
  product,
  gallery,
  onBack: _onBack,
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
    quantity?: number,
  ) => void;
}) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const galleryList = useMemo(
    () => (product.gallery?.length ? product.gallery : gallery).filter(Boolean),
    [gallery, product.gallery],
  );
  const [selectedImage, setSelectedImage] = useState(
    galleryList[0] ?? product.imageUrl,
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
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

  // Taobao products expose arbitrary option groups (颜色分类, 主色系, 尺寸, 型号, ...),
  // so every option group is rendered dynamically instead of only color/size.
  const productOptions = useMemo(
    () => product.options ?? [],
    [product.options],
  );

  // No option is pre-selected; the user must actively choose each value.
  const defaultSelection = useMemo<Record<string, string>>(() => ({}), []);

  const [selectedValues, setSelectedValues] =
    useState<Record<string, string>>(defaultSelection);

  useEffect(() => {
    const nextImage = galleryList[0] ?? product.imageUrl;
    setSelectedImage(nextImage);
    setSelectedValues(defaultSelection);
    setQuantity(1);
  }, [defaultSelection, galleryList, product.id, product.imageUrl]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    // also ensure window is at top for route navigation
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (e) {
      // ignore for SSR or non-window environments
    }
  }, [product.id]);

  const currentSku = useMemo(() => {
    const skuList = product.skus ?? [];

    if (!skuList.length) {
      return null;
    }

    const matchSku = skuList.find((sku) => {
      if (!sku.selection) return false;

      return productOptions.every((option) => {
        const selectedValueId = selectedValues[option.propId];
        return (
          !selectedValueId || sku.selection[option.propId] === selectedValueId
        );
      });
    });

    return (
      matchSku ??
      skuList.find((sku) => sku.available && sku.quantity > 0) ??
      skuList[0]
    );
  }, [productOptions, product.skus, selectedValues]);

  const optionValueImageMap = useMemo(() => {
    const map = new Map<string, string>();

    product.skus?.forEach((sku) => {
      if (!sku.image) {
        return;
      }

      Object.entries(sku.selection ?? {}).forEach(([propId, valueId]) => {
        const key = `${propId}:${valueId}`;

        if (!map.has(key)) {
          map.set(key, sku.image as string);
        }
      });
    });

    return map;
  }, [product.skus]);

  useEffect(() => {
    const nextImage = currentSku?.image ?? galleryList[0] ?? product.imageUrl;
    setSelectedImage(nextImage);
  }, [currentSku, galleryList, product.imageUrl]);

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

  const missingOptionNames = productOptions
    .filter((option) => !selectedValues[option.propId])
    .map((option) => option.name);

  const buildSelectedOptions = () =>
    productOptions.reduce<Record<string, string>>((acc, option) => {
      const valueName = option.values.find(
        (value) => value.valueId === selectedValues[option.propId],
      )?.name;
      if (valueName) {
        acc[option.name] = valueName;
      }
      return acc;
    }, {});

  const handleAddToCart = () => {
    if (missingOptionNames.length > 0) {
      toast.error("Please select an option", {
        description: `Choose ${missingOptionNames.join(", ")} before adding to cart.`,
      });
      return;
    }

    triggerFlyToCart();

    const selectedOptions = buildSelectedOptions();

    window.setTimeout(() => {
      onAddToCart(product, selectedOptions, quantity);
    }, 420);
  };

  const handleBuyNow = () => {
    if (missingOptionNames.length > 0) {
      toast.error("Please select an option", {
        description: `Choose ${missingOptionNames.join(", ")} before continuing.`,
      });
      return;
    }

    onSelectProduct(product);
  };

  const thumbnails = Array.from(
    new Set([...galleryList, product.imageUrl].filter(Boolean)),
  );

  console.log("product detail page render", product);

  return (
    <div className="mx-auto mt-0 max-w-8xl px-4 py-0 sm:px-6 lg:px-0 ">
      <div className="mb-5 flex items-center justify-between"></div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] md:items-start">
        <div
          ref={contentRef}
          className="space-y-5 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="space-y-4">
            <div className="flex gap-3 px-2 sm:px-4">
              <div className="flex w-16 shrink-0 flex-col gap-3 sm:w-18">
                {thumbnails.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`View ${product.title.en} image ${index + 1}`}
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
                      alt={`${product.title.en} view ${index + 1}`}
                      className="h-16 w-full object-cover sm:h-20"
                    />
                  </button>
                ))}
              </div>

              <div
                ref={imageRef}
                className="mx-auto flex w-full max-w-[520px] flex-1 items-center justify-center overflow-hidden rounded-[15px] "
              >
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.title.en}
                  className="block max-h-[520px] w-full object-contain"
                />
              </div>
            </div>
          </div>

          {product.description ? (
            <div
              className="
      rounded-[24px]
      border
      border-slate-200
      bg-white
      p-4
      shadow-[0_12px_32px_rgba(15,23,42,0.04)]
    "
            >
              <div
                className="
        product-description
        mx-auto
        max-w-[750px]
        overflow-hidden
        prose
        max-w-none

      2xl:border-none
        [&>div]:mx-auto
        [&>div]:w-full
        [&>div]:max-w-full

        [&_img]:
        mx-auto
        block
        h-auto
        w-full
        max-w-full
        rounded-xl
        border
        border-slate-200

        [&_p]:
        text-center
      "
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col pt-2  md:sticky md:top-6 md:max-h-[calc(100vh-5rem)] md:self-start">
          <div className="shrink-0 border-b pb-2 border-slate-200 bg-white pb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-slate-500" />
                {product.shopId ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/shop/${product.shopId}`)}
                    className="cursor-pointer font-medium text-slate-600 underline-offset-2 hover:text-[#ff6a00] hover:underline"
                  >
                    {product.shopName.en}
                  </button>
                ) : (
                  <span>{product.shopName.en}</span>
                )}
              </div>
            </div>

            <div className="mt-3  space-y-3">
              <h1 className="text-xl font-bold leading-[1.32] text-slate-900">
                {product.title.en}
              </h1>
            </div>

            {/* Card price */}
            <div
              className="
    relative
    mt-3
    overflow-hidden
    rounded-xl
    bg-gradient-to-r
from-[#c00021]
to-[#ff002b]
    px-4
    py-3
    shadow-md
  "
            >
              <div
                className="
      absolute
      -right-8
      -top-8
      h-24
      w-24
      rounded-full
      bg-white/10
      blur-2xl
    "
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="
          text-xs
          font-medium
          text-white/60
          line-through
        "
                  >
                    {formatCurrency(listPrice)}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <span
                    className="
            absolute
            -right-1
            top-1/2
            -translate-y-1/2
            rotate-[0deg]
            text-[3rem]
            font-black
            leading-none
            tracking-[-0.01em]
            text-[#ffee32]
            font-stretch-150%
          "
                  >
                    -{discountPercent}%
                  </span>
                )}

                <div
                  className="
        mt-1
        flex
        items-end
        gap-2
      "
                >
                  <p
                    className="
          text-3xl
          font-black
          tracking-tight
          text-white
        "
                  >
                    {formatCurrency(salePrice || listPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto   pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {productOptions.map((option) => (
              <div key={option.propId} className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  {option.name}
                  {!selectedValues[option.propId] ? (
                    <span className="ml-1 text-xs font-normal text-red-500">
                      (required)
                    </span>
                  ) : null}
                </p>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isColorOption = /color|颜色|色/i.test(option.name);
                    const valueImage = isColorOption
                      ? optionValueImageMap.get(
                          `${option.propId}:${value.valueId}`,
                        )
                      : undefined;
                    const isSelected =
                      selectedValues[option.propId] === value.valueId;

                    return (
                      <button
                        key={value.valueId}
                        type="button"
                        onClick={() =>
                          setSelectedValues((prev) => {
                            if (prev[option.propId] === value.valueId) {
                              const next = { ...prev };
                              delete next[option.propId];
                              return next;
                            }
                            return { ...prev, [option.propId]: value.valueId };
                          })
                        }
                        className={`flex items-center gap-2 cursor-pointer rounded-lg border px-2 py-1 text-sm transition ${
                          isSelected
                            ? "border-[#ff6a00] bg-[#fff5ee] text-[#ff6a00]"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {valueImage ? (
                          <img
                            src={valueImage}
                            alt={value.name}
                            className="h-7 w-7 rounded-sm object-cover"
                          />
                        ) : null}
                        <span>{value.name}</span>
                      </button>
                    );
                  })}
                </div>
                
              </div>
              
            ))}

            <div className="space-y-2 mb-15">
              <p className="text-sm font-semibold text-slate-800">Quantity</p>
              <div className="flex w-fit items-center  rounded-full border border-slate-200 bg-slate-50 px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((next) => Math.max(1, next - 1))}
                  className="h-10 w-10 cursor-pointer text-xl text-slate-600"
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
                  className="h-10 w-10 cursor-pointer text-xl text-slate-600"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0  z-10  border-t border-slate-200 bg-white/95 pt-3 pb-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#ff5a00] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,106,0,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_32px_rgba(255,106,0,0.33)]"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />
                <span>Add to cart</span>
              </button>

              <button
                type="button"
                className="flex items-center cursor-pointer justify-center gap-2 rounded-full border border-[#ffb17a] bg-[#fff7f2] px-4 py-3 text-sm font-semibold text-[#d85b00] transition hover:bg-[#fff1e7]"
                onClick={handleBuyNow}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                <span>Buy now</span>
              </button>

              <button
                type="button"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                onClick={() => setIsFavorite((current) => !current)}
                className={`flex h-12 w-12 cursor-pointer shrink-0 items-center justify-center rounded-full border transition ${
                  isFavorite
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                  strokeWidth={2.2}
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
            const target = document.querySelector("[data-cart-target='true']");

            if (target) {
              const cartIcon = target.querySelector("[data-cart-icon='true']");

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
            }

            setFlyState(null);
          }}
          className="
    pointer-events-none
    fixed
    left-0
    top-0
    z-[80]
    overflow-hidden
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-xl
  "
          style={{
            width: flyState.width,
            height: flyState.height,
          }}
        >
          <div className="flex h-full w-full items-center gap-3 p-3">
            <div
              className="
        relative
        h-full
        w-[34%]
        shrink-0
        overflow-hidden
        rounded-xl
        bg-slate-100
      "
            >
              <motion.img
                src={flyState.imageSrc}
                alt={flyState.title}
                className="
          h-full
          w-full
          object-cover
        "
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 0.6,
                }}
              />
            </div>

            <div className="flex-1">
              <p
                className="
          line-clamp-2
          text-xs
          font-semibold
          text-slate-700
        "
              >
                {flyState.title}
              </p>

              <div
                className="
          mt-2
          flex
          items-center
          justify-between
        "
              >
                <span
                  className="
            text-sm
            font-bold
            text-[#ff5000]
          "
                >
                  {formatCurrency(salePrice || listPrice)}
                </span>

                <span
                  className="
            rounded-full
            bg-orange-50
            px-2
            py-1
            text-[10px]
            font-semibold
            text-orange-500
          "
                >
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

export default function ProductDetailPage({
  onAddToCart,
}: {
  onAddToCart?: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
    quantity?: number,
  ) => void;
} = {}) {
  const navigate = useNavigate();
  const { sourceItemId } = useParams();
  const [product, setProduct] = useState<ProductCardType | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceItemId) {
      setError("Missing product id.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = (await productService.getProductDetail(
          sourceItemId,
          // undefined,
        )) as {
          itemId?: string;
          title?: string;
          description?: string;
          images?: string[];
          shop?: { id?: string; name?: string };
          category?: { id?: string; name?: string };
          available?: boolean;
          totalQuantity?: number;
          options?: Array<{
            propId?: string;
            name?: string;
            values?: Array<{ valueId?: string; name?: string }>;
          }>;
          skus?: Array<{
            skuId?: string;
            mpSkuId?: string;
            selectionKey?: string;
            selection?: Record<string, string>;
            image?: string;
            priceRmbRaw?: number;
            promotionPriceRmbRaw?: number;
            couponPriceRmbRaw?: number;
            shippingCents?: number;
            quantity?: number;
            available?: boolean;
          }>;
          image?: string;
        };

        const imageList = Array.from(
          new Set([...(data.images ?? []), data.image ?? ""].filter(Boolean)),
        );

        const firstSku = data.skus?.[0];
        const priceText = formatCurrency(
          firstSku?.promotionPriceRmbRaw ?? firstSku?.priceRmbRaw ?? 0,
        );

        const mappedProduct: ProductCardType = {
          id: data.itemId ?? sourceItemId,
          section: {
            en: data.category?.name ?? "Products",
            km: data.category?.name ?? "Products",
          },
          title: {
            en: data.title ?? "Product",
            km: data.title ?? "Product",
          },
          shopName: {
            en: data.shop?.name ?? "E-Taobao",
            km: data.shop?.name ?? "E-Taobao",
          },
          shopId: data.shop?.id ?? undefined,
          priceText,
          imageUrl: data.image ?? imageList[0] ?? "",
          productUrl: "",
          benefit: {
            en: data.available === false ? "Out of stock" : "Best seller",
            km: data.available === false ? "Out of stock" : "Best seller",
          },
          gallery: imageList,
          description: data.description ?? "",
          categoryName: data.category?.name ?? "Products",
          available: data.available ?? true,
          totalQuantity: data.totalQuantity ?? 0,
          options:
            data.options?.map((option) => ({
              propId: option.propId ?? "",
              name: option.name ?? "",
              values:
                option.values?.map((value) => ({
                  valueId: value.valueId ?? "",
                  name: value.name ?? "",
                })) ?? [],
            })) ?? [],
          skus:
            data.skus?.map((sku) => ({
              skuId: sku.skuId ?? "",
              mpSkuId: sku.mpSkuId ?? "",
              selectionKey: sku.selectionKey ?? "",
              selection: sku.selection ?? {},
              image: sku.image ?? "",
              priceRmbRaw: sku.priceRmbRaw ?? 0,
              promotionPriceRmbRaw: sku.promotionPriceRmbRaw ?? 0,
              couponPriceRmbRaw: sku.couponPriceRmbRaw ?? 0,
              shippingCents: sku.shippingCents ?? 0,
              quantity: sku.quantity ?? 0,
              available: sku.available ?? true,
            })) ?? [],
        };

        setProduct(mappedProduct);
        setGallery(imageList);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to load product.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => controller.abort();
  }, [sourceItemId]);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (e) {
      // ignore in non-window environments
    }
  }, [sourceItemId]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl p-10 mt-5 text-center">
        <p className="text-lg font-semibold text-red-600">
          {error ?? "Product not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 rounded-full bg-[#ff6a00] px-5 py-2 text-sm font-semibold text-white"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductDetailView
        product={product}
        gallery={gallery}
        onBack={() => navigate(-1)}
        onSelectProduct={(selectedProduct) => {
          console.log("selected product:", selectedProduct);
        }}
        onAddToCart={(selectedProduct, selectedOptions, quantity) => {
          onAddToCart?.(selectedProduct, selectedOptions, quantity);
        }}
      />
      {/* <TestingComponent /> */}
      <div className="mt-0">
        <ExploreProduct />
      </div>
    </>
  );
}
