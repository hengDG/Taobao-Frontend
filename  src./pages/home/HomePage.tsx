import { Suspense } from "react";

import { HomeHero } from "@/components/home/home-hero";
import { HomeMarketplacePanel } from "@/components/home/home-marketplace-panel";
import { Testing } from "@/components/testing";
import { ProductGrid } from "@/components/product-grid";
import { HomepageSections } from "@/components/homepage-sections";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import { products } from "@/data/products";
import taobaoService from "@/services/taobao";
import type { ProductCard as ProductCardType } from "@/types/product";
import type { TaobaoHomeRow, TaobaoProduct } from "@/types/taobao.types";

type HomePageData = {
  sections: TaobaoHomeRow[];
  items: TaobaoProduct[];
  error: string | null;
};

let homePageData: HomePageData | undefined;
let homePagePromise: Promise<void> | undefined;

function loadHomePageData(): HomePageData {
  if (homePageData) {
    return homePageData;
  }

  if (!homePagePromise) {
    homePagePromise = Promise.all([
      taobaoService.getHomepage(),
      taobaoService.getThemeProducts({ themeId: "11647" }),
    ])
      .then(([homepageResult, themeResult]) => {
        homePageData = {
          sections: homepageResult.rows ?? [],
          items: themeResult.items ?? [],
          error: null,
        };
      })
      .catch((error) => {
        console.error(error);
        homePageData = {
          sections: [],
          items: [],
          error: "Unable to load homepage data.",
        };
      });
  }

  throw homePagePromise;
}

function HomePageContent({
  onSelectProduct,
}: {
  onSelectProduct?: (product: ProductCardType) => void;
}) {
  const data = loadHomePageData();

  return (
    <div className="bg-[#f5f6f8] pb-24">
      <HomeHero />
      <HomeMarketplacePanel />
      <ProductGrid products={products} onSelectProduct={onSelectProduct} />
      <Testing items={data.items} error={data.error} />
      <HomepageSections sections={data.sections} error={data.error} />
    </div>
  );
}

function HomePageFallback() {
  return (
    <div className="bg-[#f5f6f8] pb-24">
      <HomeHero />
      <HomeMarketplacePanel />
      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductCardSkeleton count={5} />
      </div>
    </div>
  );
}

export function HomePage({
  onSelectProduct,
}: {
  onSelectProduct?: (product: ProductCardType) => void;
}) {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent onSelectProduct={onSelectProduct} />
    </Suspense>
  );
}
