import { ProductDetailView } from "@/components/product-detail-view";
import type { ProductCard as ProductCardType } from "@/types/product";

export function ProductDetailPage({
  product,
  onBack,
  onSelectProduct,
  onAddToCart,
}: {
  product: ProductCardType | null;
  onBack: () => void;
  onSelectProduct: (product: ProductCardType) => void;
  onAddToCart: (
    product: ProductCardType,
    selectedOptions?: Record<string, string>,
  ) => void;
}) {
  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f5f6f8] px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-slate-500">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f6f8] pb-24">
      <ProductDetailView
        product={product}
        gallery={[product.imageUrl]}
        onBack={onBack}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
