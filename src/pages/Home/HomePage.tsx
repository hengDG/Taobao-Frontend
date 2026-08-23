import { HomeHero } from "@/components/home/HomeHero";

import { HomeMarketplacePanel } from "@/components/home/HomeMarketplacePanel";

import TestingComponent from "@/components/testing";
import HomepageSectionList from "@/components/testing-homepage";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <HomeMarketplacePanel />

      {/* <ProductGrid products={products} /> */}

      <TestingComponent />

      <div style={{ marginTop: 32 }}>
        <HomepageSectionList />
      </div>
    </>
  );
}
