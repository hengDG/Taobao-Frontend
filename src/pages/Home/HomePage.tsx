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
          mt-6
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
            px-5
            py-2
            text-sm
            font-semibold
            transition
            cursor-pointer

            ${
              activeTab === "explore"
                ? "bg-[#ff6a00] text-white"
                : "bg-slate-100 text-slate-700"
            }

          `}
        >
          Explore
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`
            rounded-xl
            px-5
            py-2
            text-sm
            font-semibold
            font-semibold
            transition
            cursor-pointer
            ${
              activeTab === "theme"
                ? "bg-[#ff6a00] text-white"
                : "bg-slate-100 text-slate-700"
            }

          `}
        >
          Theme Products
        </button>

        <button
          onClick={() => setActiveTab("homepage")}
          className={`
            rounded-xl
            px-5
            py-2
            text-sm
            font-semibold
            transition
            cursor-pointer
            ${
              activeTab === "homepage"
                ? "bg-[#ff6a00] text-white"
                : "bg-slate-100 text-slate-700"
            }

          `}
        >
          Homepage
        </button>
      </div>

      {/* CONTENT */}

      <div className="mt-5">
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
