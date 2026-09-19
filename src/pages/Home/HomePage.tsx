import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import { HomeMarketplaceDashboard } from "@/components/home/HomeHeroNew";
import ExploreProduct from "@/components/product/ExploreProduct";
import TestingComponent from "@/components/product/GuessYouLike";
import HomepageSectionList from "@/components/testing-homepage";

type TabType = "explore" | "theme" | "homepage";

const tabs: { key: TabType; label: string }[] = [
  { key: "explore", label: "Explore" },
  { key: "theme", label: "Guess You Like" },
  { key: "homepage", label: "1688" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <HomeMarketplaceDashboard />

      <div className="grid items-center grid-cols-3 px-2 mx-auto mt-18">
        {/* left spacer to balance the grid */}
        <div />

        <div className="flex justify-center">
          <div className="flex items-center p-1 border shadow-sm w-fit rounded-xl border-slate-200">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative cursor-pointer rounded-lg px-4 py-1 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-[#194891]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-home-tab"
                      className="absolute inset-0 rounded-lg bg-[#194891] shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#194891] hover:text-[#194891]"
            aria-label="Refresh product data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        {activeTab === "explore" && <ExploreProduct refreshKey={refreshKey} />}
        {activeTab === "theme" && <TestingComponent refreshKey={refreshKey} />}
        {activeTab === "homepage" && (
          <HomepageSectionList refreshKey={refreshKey} />
        )}
      </div>
    </>
  );
}
