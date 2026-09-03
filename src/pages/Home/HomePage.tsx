import { useState } from "react";

import { HomeMarketplaceDashboard } from "@/components/home/HomeHeroNew";

import ExploreProduct from "@/components/product/ExploreProduct";

import TestingComponent from "@/components/testing";

import HomepageSectionList from "@/components/testing-homepage";

type TabType = "explore" | "theme" | "homepage";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("explore");

  return (
    <>
      <HomeMarketplaceDashboard />

      {/* TAB BUTTON */}

      <div
        className="
          mx-auto
          mt-3
          flex
          max-w-8xl
          justify-center
          gap-3
          px-4
        "
      >
        <button
          onClick={() => setActiveTab("explore")}
          className={`
  rounded-xl
  border
  px-5
  py-2
  text-sm
  font-semibold
  transition-all
  duration-300
  cursor-pointer

  ${
    activeTab === "explore"
      ? `
        border-[#194891]
        bg-[#194891]/10
        text-[#194891]
        shadow-sm
        border-none
      `
      : `
         border-[#194891]/15
         border-none
        text-slate-700
        hover:border-[#194891]/30
        hover:bg-[#194891]/5
        hover:text-[#194891]
      `
  }
`}
        >
          Explore
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`
  rounded-xl
  border
  px-5
  py-2
  text-sm
  font-semibold
  transition-all
  duration-300
  cursor-pointer

  ${
    activeTab === "theme"
      ? `
        border-[#194891]
        bg-[#194891]/10
        text-[#194891]
        shadow-sm
      `
      : `
        border-[#194891]/15
        text-slate-700
        hover:border-[#194891]/30
        hover:bg-[#194891]/5
        hover:text-[#194891]
      `
  }
`}
        >
          Guess You Like
        </button>

        <button
          onClick={() => setActiveTab("homepage")}
          className={`
  rounded-xl
  border
  px-5
  py-2
  text-sm
  font-semibold
  transition-all
  duration-300
  cursor-pointer

  ${
    activeTab === "homepage"
      ? `
        border-[#194891]
        bg-[#194891]/0
        text-[#194891]
        shadow-sm
      `
      : `
        border-[#194891]/15
        text-slate-700
        hover:border-[#194891]/30
        hover:bg-[#194891]/5
        hover:text-[#194891]
      `
  }

          `}
        >
          1688
        </button>
      </div>

      {/* CONTENT */}

      <div className="mt-2">
        {activeTab === "explore" && <ExploreProduct />}

        {activeTab === "theme" && <TestingComponent />}

        {activeTab === "homepage" && <HomepageSectionList />}
      </div>
    </>
  );
}

// import { useState } from "react";

// import { HomeMarketplaceDashboard } from "@/components/home/HomeHeroNew";

// import ExploreProduct from "@/components/product/ExploreProduct";

// import TestingComponent from "@/components/testing";

// import HomepageSectionList from "@/components/testing-homepage";

// type TabType = "explore" | "theme" | "homepage";

// export default function HomePage() {
//   const [activeTab, setActiveTab] = useState<TabType>("explore");

//   return (
//     <>
//       <HomeMarketplaceDashboard />

//       {/* MAIN PRODUCT CONTAINER */}

//       <div
//         className="
//           mx-auto
//           mt-8
//           max-w-8xl
//           rounded-3xl
//           bg-white
//           px-5
//           py-5
//           shadow-sm
//         "
//       >
//         {/* TAB HEADER */}

//         <div
//           className="
//             mb-6
//             flex
//             items-center
//             justify-center
//             gap-3
//             border-b
//             border-slate-200
//             pb-4
//           "
//         >
//           <button
//             onClick={() => setActiveTab("explore")}
//             className={`
//               rounded-full
//               px-5
//               py-2
//               text-sm
//               font-semibold

//               ${
//                 activeTab === "explore"
//                   ? "bg-orange-500 text-white"
//                   : "bg-slate-100 text-slate-700"
//               }

//             `}
//           >
//             Explore
//           </button>

//           <button
//             onClick={() => setActiveTab("theme")}
//             className={`
//               rounded-full
//               px-5
//               py-2
//               text-sm
//               font-semibold

//               ${
//                 activeTab === "theme"
//                   ? "bg-orange-500 text-white"
//                   : "bg-slate-100 text-slate-700"
//               }

//             `}
//           >
//             Theme
//           </button>

//           <button
//             onClick={() => setActiveTab("homepage")}
//             className={`
//               rounded-full
//               px-5
//               py-2
//               text-sm
//               font-semibold

//               ${
//                 activeTab === "homepage"
//                   ? "bg-orange-500 text-white"
//                   : "bg-slate-100 text-slate-700"
//               }

//             `}
//           >
//             Homepage
//           </button>
//         </div>

//         {/* PRODUCT CONTENT */}

//         {activeTab === "explore" && <ExploreProduct />}

//         {activeTab === "theme" && <TestingComponent />}

//         {activeTab === "homepage" && <HomepageSectionList />}
//       </div>
//     </>
//   );
// }
