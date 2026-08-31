import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { getLocalizedText, useLanguage } from "@/contexts/LanguageContext";

import type { ProductCard } from "@/types/product";

export type CartLineItem = {
  product: ProductCard;
  quantity: number;
  selectedOptions: Record<string, string>;
  selectedForCheckout?: boolean;
};

type CartPageProps = {
  items: CartLineItem[];

  onContinueShopping: () => void;

  onUpdateQuantity: (productId: string, nextQuantity: number) => void;

  onRemoveItem: (productId: string) => void;

  onCheckout: () => void;
};

function parsePrice(priceText: string) {
  const normalized = priceText.replace(/[^\d.]/g, "");

  const value = Number(normalized);

  return Number.isNaN(value) ? 0 : value;
}

function resolveCartItemImage(item: CartLineItem) {
  const { product, selectedOptions } = item;

  if (!product.skus?.length) {
    return product.imageUrl;
  }

  const optionEntries = Object.entries(selectedOptions);

  if (optionEntries.length === 0) {
    return product.imageUrl;
  }

  const matchedSku = product.skus.find((sku) => {
    if (!sku.selection || Object.keys(sku.selection).length === 0) {
      return false;
    }

    return optionEntries.every(([optionName, optionValue]) => {
      const option = product.options?.find(
        (candidate) => candidate.name === optionName,
      );

      if (!option) {
        return false;
      }

      const matchedValue = option.values.find(
        (value) => value.name === optionValue,
      );

      if (!matchedValue) {
        return false;
      }

      return sku.selection[option.propId] === matchedValue.valueId;
    });
  });

  return matchedSku?.image || product.imageUrl;
}

export function CartPage({
  items,
  onContinueShopping,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartPageProps) {
  const { language } = useLanguage();

  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);

  const [deleteSingleItemId, setDeleteSingleItemId] = useState<string | null>(
    null,
  );

  const [selectedItemIds, setSelectedItemIds] = useState<
    Record<string, boolean>
  >({});

  /*
   * Initialize selected products
   */
  useEffect(() => {
    setSelectedItemIds((current) => {
      const next = {
        ...current,
      };

      for (const item of items) {
        if (next[item.product.id] === undefined) {
          next[item.product.id] = item.selectedForCheckout ?? true;
        }
      }

      for (const key of Object.keys(next)) {
        if (!items.some((item) => item.product.id === key)) {
          delete next[key];
        }
      }

      return next;
    });
  }, [items]);

  /*
   * Selected products
   */
  const selectedItems = useMemo(
    () =>
      items.filter(
        (item) =>
          selectedItemIds[item.product.id] ?? item.selectedForCheckout ?? true,
      ),
    [items, selectedItemIds],
  );

  const selectedCount = selectedItems.length;

  /*
   * Subtotal
   */
  const selectedSubtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + parsePrice(item.product.priceText) * item.quantity,
        0,
      ),
    [selectedItems],
  );

  /*
   * Total selected units
   */
  const selectedUnitCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  /*
   * Price calculation
   */
  const freeShippingThreshold = 500;

  const shippingFee =
    selectedCount === 0
      ? 0
      : selectedSubtotal >= freeShippingThreshold
        ? 0
        : 5.99;

  const serviceFee = selectedCount === 0 ? 0 : 1.99;

  const estimatedDiscount =
    selectedSubtotal >= 300 ? selectedSubtotal * 0.05 : 0;

  const grandTotal = Math.max(
    0,
    selectedSubtotal + shippingFee + serviceFee - estimatedDiscount,
  );

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - selectedSubtotal,
  );

  const freeShippingProgress = Math.min(
    100,
    (selectedSubtotal / freeShippingThreshold) * 100,
  );

  const allSelected = items.length > 0 && selectedCount === items.length;

  /*
   * Translation
   */
  const title = language === "km" ? "កន្ត្រក" : "Cart";

  const emptyText =
    language === "km"
      ? "មិនទាន់មានទំនិញនៅក្នុងកន្ត្រកទេ។"
      : "Your cart is empty right now.";

  const continueShoppingText =
    language === "km" ? "បន្តទិញទំនិញ" : "Continue shopping";

  const checkoutText = language === "km" ? "ទៅបង់ប្រាក់" : "Checkout";

  const selectAllText = language === "km" ? "ជ្រើសទាំងអស់" : "Select all";

  const unselectAllText =
    language === "km" ? "ដោះជ្រើសទាំងអស់" : "Unselect all";

  const deleteSelectedText =
    language === "km" ? "លុបដែលបានជ្រើស" : "Remove selected";

  const editText = language === "km" ? "កែសម្រួល" : "Organize cart";

  const backText = language === "km" ? "ត្រឡប់" : "Back";

  const summaryTitle =
    language === "km" ? "សង្ខេបការបញ្ជាទិញ" : "Order summary";

  const subtotalText = language === "km" ? "តម្លៃទំនិញ" : "Items subtotal";

  const shippingText = language === "km" ? "ថ្លៃដឹកជញ្ជូន" : "Shipping";

  const serviceFeeText = language === "km" ? "ថ្លៃសេវា" : "Service fee";

  const discountText =
    language === "km" ? "បញ្ចុះតម្លៃប៉ាន់ស្មាន" : "Estimated discount";

  const totalText = language === "km" ? "សរុបត្រូវបង់" : "Total";

  const tipsTitle = language === "km" ? "គន្លឹះមានប្រយោជន៍" : "Useful ideas";

  const confirmDeleteTitle =
    language === "km" ? "លុបទំនិញដែលបានជ្រើស" : "Remove selected items";

  const confirmDeleteDescription =
    language === "km"
      ? "តើអ្នកពិតជាចង់លុបទំនិញទាំងនេះចេញពីកន្ត្រកមែនទេ?"
      : "Are you sure you want to remove these items from your cart?";

  const cancelText = language === "km" ? "បោះបង់" : "Cancel";

  const confirmText = language === "km" ? "លុប" : "Delete";

  /*
   * Group products by shop
   */
  const groupedItems = useMemo(() => {
    const groups = new Map<
      string,
      {
        shopName: string;
        items: CartLineItem[];
      }
    >();

    items.forEach((item) => {
      const shopName = getLocalizedText(item.product.shopName, language);

      const existing = groups.get(shopName);

      if (existing) {
        existing.items.push(item);

        return;
      }

      groups.set(shopName, {
        shopName,
        items: [item],
      });
    });

    return Array.from(groups.values());
  }, [items, language]);

  /*
   * Select / deselect all
   */
  const setAllSelected = (nextValue: boolean) => {
    const nextState: Record<string, boolean> = {};

    items.forEach((item) => {
      nextState[item.product.id] = nextValue;
    });

    setSelectedItemIds(nextState);
  };

  /*
   * Toggle one product
   */
  const toggleSelected = (productId: string) => {
    setSelectedItemIds((current) => ({
      ...current,

      [productId]: !(current[productId] ?? true),
    }));
  };

  /*
   * Delete selected products
   */
  const handleDeleteSelected = () => {
    selectedItems.forEach((item) => onRemoveItem(item.product.id));

    setIsDeleteSelectedOpen(false);

    setIsEditMode(false);
  };

  /*
   * Delete one product
   */
  const handleDeleteSingleItem = (itemId: string) => {
    onRemoveItem(itemId);

    setDeleteSingleItemId(null);
  };

  /*
   * EMPTY CART
   */

  console.log("Cart items:", items);
  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl  px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-[#1b2f4e]">{title}</h1>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">{emptyText}</p>

          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-4 inline-flex cursor-pointer rounded-xl bg-[#1f5fb8] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
          >
            {continueShoppingText}
          </button>
        </div>
      </main>
    );
  }

  /*
   * CART
   */
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-4 mt-10 pb-28 sm:px-6 lg:py-8">
      <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        {/* LEFT */}

        <div className="space-y-3">
          {/* Header */}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-semibold text-[#1b2f4e]">{title}</h1>

              <p className="text-sm font-medium text-[#1f5fb8]">
                {selectedCount} {language === "km" ? "បានជ្រើស" : "selected"}
              </p>
            </div>

            {/* Edit buttons */}

            {isEditMode ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#1f5fb8] hover:text-[#1f5fb8]"
                >
                  ← {backText}
                </button>

                <button
                  type="button"
                  onClick={() => setAllSelected(!allSelected)}
                  className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#1f5fb8] hover:text-[#1f5fb8]"
                >
                  {allSelected ? unselectAllText : selectAllText}
                </button>

                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => setIsDeleteSelectedOpen(true)}
                  className="cursor-pointer rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteSelectedText}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#1f5fb8] hover:text-[#1f5fb8]"
              >
                {editText}
              </button>
            )}
          </div>

          {/* Remove selected warning */}

          {isDeleteSelectedOpen ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                {confirmDeleteTitle}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {confirmDeleteDescription}
              </p>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteSelectedOpen(false)}
                  className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  {cancelText}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="cursor-pointer rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          ) : null}

          {/* Shops */}

          {groupedItems.map(({ shopName, items: groupItems }) => {
            const shopAllSelected = groupItems.every(
              (item) =>
                selectedItemIds[item.product.id] ??
                item.selectedForCheckout ??
                true,
            );

            return (
              <div
                key={shopName}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Shop header */}

                <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={shopAllSelected}
                      onClick={() => {
                        const nextValue = !shopAllSelected;

                        const nextMap: Record<string, boolean> = {
                          ...selectedItemIds,
                        };

                        groupItems.forEach((item) => {
                          nextMap[item.product.id] = nextValue;
                        });

                        setSelectedItemIds(nextMap);
                      }}
                      className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-slate-300 transition hover:border-[#1f5fb8]"
                    >
                      <span
                        className={`size-2.5 rounded-full transition ${
                          shopAllSelected ? "bg-[#1f5fb8]" : "bg-transparent"
                        }`}
                      />
                    </button>

                    <p className="text-base font-semibold text-[#1b2f4e]">
                      {shopName}
                    </p>
                  </div>

                  <span className="text-[11px] font-medium text-slate-500">
                    {groupItems.length}{" "}
                    {language === "km" ? "មុខទំនិញ" : "items"}
                  </span>
                </div>

                {/* Shop items */}

                <div className="divide-y divide-slate-200">
                  {[...groupItems].reverse().map((item) => {
                    const localizedTitle = getLocalizedText(
                      item.product.title,
                      language,
                    );

                    const localizedShop = getLocalizedText(
                      item.product.shopName,
                      language,
                    );

                    const isSelected =
                      selectedItemIds[item.product.id] ??
                      item.selectedForCheckout ??
                      true;

                    const cartItemImage = resolveCartItemImage(item);

                    return (
                      <article
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-3 py-4 lg:grid lg:grid-cols-[24px_100px_minmax(0,1fr)_130px_70px_130px_40px] lg:gap-3"
                      >
                        {/* Checkbox */}

                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          onClick={() => toggleSelected(item.product.id)}
                          className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-slate-300 transition hover:border-[#1f5fb8]"
                        >
                          <span
                            className={`size-3 rounded-full transition ${
                              isSelected ? "bg-[#1f5fb8]" : "bg-transparent"
                            }`}
                          />
                        </button>

                        {/* Image */}

                        <Link
                          to={`/products/${item.product.id}`}
                          className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 lg:h-24 lg:w-24"
                        >
                          <img
                            src={cartItemImage}
                            alt={localizedTitle}
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        {/* Product info */}

                        <div className="min-w-0 flex-1 self-start pt-1">
                          <Link to={`/products/${item.product.id}`}>
                            <p className="line-clamp-2 text-[14px] leading-6 font-medium text-slate-800 transition hover:text-[#ff5000]">
                              {localizedTitle}
                            </p>
                          </Link>

                          <p className="mt-1 text-xs text-slate-400">
                            {localizedShop}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-sm border border-emerald-500 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600">
                              Free shipping
                            </span>

                            <span className="text-[11px] text-[#ff5000]">
                              7 Days Return
                            </span>

                            <span className="text-[11px] text-[#ff5000]">
                              Buyer Protection
                            </span>
                          </div>
                        </div>

                        {/* Selected options */}

                        <div className="hidden pt-1 text-xs leading-5 text-slate-500 lg:block">
                          {Object.entries(item.selectedOptions).length > 0 ? (
                            Object.entries(item.selectedOptions).map(
                              ([name, value]) => (
                                <p key={name}>
                                  {name}:
                                  <span className="ml-1 text-slate-600">
                                    {value}
                                  </span>
                                </p>
                              ),
                            )
                          ) : (
                            <p className="text-slate-400">Default option</p>
                          )}
                        </div>

                        {/* Price */}

                        <div className="pt-1">
                          <p className="text-base font-bold text-[#ff5000]">
                            {item.product.priceText}
                          </p>
                        </div>

                        {/* Quantity */}

                        <div className="flex items-center justify-center pt-1">
                          <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,

                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-full w-9 cursor-pointer items-center justify-center text-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-200"
                            >
                              −
                            </button>

                            <span className="flex h-full w-10 items-center justify-center border-x border-slate-200 text-sm font-medium text-slate-700">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,

                                  item.quantity + 1,
                                )
                              }
                              className="flex h-full w-9 cursor-pointer items-center justify-center text-lg text-slate-600 transition hover:bg-slate-50 hover:text-[#ff5000]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Delete */}

                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="button"
                            aria-label={
                              language === "km" ? "លុបទំនិញ" : "Remove product"
                            }
                            onClick={() =>
                              setDeleteSingleItemId(item.product.id)
                            }
                            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="size-5" strokeWidth={2} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SUMMARY */}

        <aside className="mt-5 lg:mt-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-[#1b2f4e]">
              {summaryTitle}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {selectedCount} {language === "km" ? "មុខទំនិញ" : "items"} ·{" "}
              {selectedUnitCount} {language === "km" ? "ឯកតា" : "units"}
            </p>

            {/* Price summary */}

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>{subtotalText}</span>

                <span>¥{selectedSubtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>{shippingText}</span>

                <span>
                  {shippingFee === 0 ? "FREE" : `¥${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>{serviceFeeText}</span>

                <span>¥{serviceFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-600">
                <span>{discountText}</span>

                <span>
                  -¥
                  {estimatedDiscount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="my-4 h-px bg-slate-200" />

            {/* Total */}

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">{totalText}</span>

              <span className="text-xl font-bold text-[#ff5000]">
                ¥{grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Free shipping */}

            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">
                Free shipping
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {remainingForFreeShipping > 0
                  ? `Add ¥${remainingForFreeShipping.toFixed(2)} more to unlock free shipping`
                  : "You have unlocked free shipping"}
              </p>

              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-[#1f5fb8] transition-all"
                  style={{
                    width: `${freeShippingProgress}%`,
                  }}
                />
              </div>
            </div>

            {/* Tips */}

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">
                {tipsTitle}
              </p>

              <ul className="mt-1 space-y-1 text-xs text-amber-700">
                <li>
                  Select items from the same shop to reduce shipping cost.
                </li>

                <li>
                  Orders above ¥300 can receive an extra estimated discount.
                </li>
              </ul>
            </div>

            {/* Checkout */}

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setAllSelected(!allSelected)}
                className="w-[35%] cursor-pointer rounded-lg border border-slate-300 py-3 text-xs font-semibold text-slate-700 transition hover:border-[#1f5fb8] hover:text-[#1f5fb8]"
              >
                {allSelected ? unselectAllText : selectAllText}
              </button>

              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={onCheckout}
                className="w-[65%] cursor-pointer rounded-lg bg-[#ff5000] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutText}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* DELETE SINGLE ITEM MODAL */}

      {deleteSingleItemId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <p className="text-sm font-semibold text-slate-800">
              {language === "km" ? "លុបទំនិញនេះ?" : "Delete this item?"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {language === "km"
                ? "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។"
                : "This action cannot be undone."}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteSingleItemId(null)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteSingleItem(deleteSingleItemId)}
                className="cursor-pointer rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
