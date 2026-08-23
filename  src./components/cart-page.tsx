import type { ProductCard } from "@/types/product";

export type CartLineItem = {
  product: ProductCard;
  quantity: number;
  selectedOptions: Record<string, string>;
};

export function CartPage({
  items,
  onContinueShopping,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: {
  items: CartLineItem[];
  onContinueShopping: () => void;
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Cart</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-slate-600">Your cart is empty.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${JSON.stringify(item.selectedOptions)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    {item.product.title.en}
                  </p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-500 px-2 py-1 text-sm text-white"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          className="rounded bg-slate-900 px-4 py-2 text-white"
          onClick={onContinueShopping}
        >
          Continue shopping
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 px-4 py-2"
          onClick={onCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
