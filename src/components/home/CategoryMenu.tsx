import {
  ChefHat,
  ChevronDown,
  Gift,
  HouseHeart,
  PawPrint,
  ScanHeart,
  Shirt,
  Trophy,
  Wrench,
} from "lucide-react";

import { useEffect, useRef, useState, type JSX } from "react";
import { Link } from "react-router-dom";

import productService from "@/services/product/product.service";
import type { CategoryChild, CategoryGroup } from "@/shared/types";

// const categoryIconMap: Record<
//   string,
//   {
//     icon: JSX.Element;
//     bg: string;
//   }
// > = {
//   fashion: {
//     icon: <Shirt />,
//     bg: "bg-pink-500",
//   },

//   "beauty & health": {
//     icon: <ScanHeart />,
//     bg: "bg-rose-500",
//   },

//   "hobbies & gifts": {
//     icon: <Gift />,
//     bg: "bg-purple-500",
//   },

//   "home & living": {
//     icon: <HouseHeart />,
//     bg: "bg-blue-500",
//   },

//   "kitchen & dining": {
//     icon: <ChefHat />,
//     bg: "bg-orange-500",
//   },

//   pets: {
//     icon: <PawPrint />,
//     bg: "bg-green-500",
//   },

//   "sports & outdoors": {
//     icon: <Trophy />,
//     bg: "bg-cyan-500",
//   },

//   "tools & hardware": {
//     icon: <Wrench />,
//     bg: "bg-slate-600",
//   },
// };

const categoryIconMap: Record<
  string,
  {
    icon: JSX.Element;
    color: string;
  }
> = {
  fashion: {
    icon: <Shirt />,
    color: "text-blue-500",
  },

  "beauty & health": {
    icon: <ScanHeart />,
    color: "text-pink-500",
  },

  "hobbies & gifts": {
    icon: <Gift />,
    color: "text-purple-500",
  },

  "home & living": {
    icon: <HouseHeart />,
    color: "text-orange-500",
  },

  "kitchen & dining": {
    icon: <ChefHat />,
    color: "text-amber-500",
  },

  pets: {
    icon: <PawPrint />,
    color: "text-green-500",
  },

  "sports & outdoors": {
    icon: <Trophy />,
    color: "text-red-500",
  },

  "tools & hardware": {
    icon: <Wrench />,
    color: "text-cyan-600",
  },
};
const getCategoryIcon = (label?: string) => {
  if (!label) return undefined;

  const normalized = label.trim().toLowerCase();

  return categoryIconMap[normalized];
};

export default function CategoryMenu() {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);

  const [activeCategory, setActiveCategory] = useState<CategoryGroup | null>(
    null,
  );

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const response = await productService.getCategories();

        if (mounted) {
          setCategories(response);
        }
      } catch {
        if (mounted) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;

      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  const openMenu = (group: CategoryGroup) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    setActiveCategory(group);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  if (!categories.length) {
    return null;
  }

  return (
    <div className="relative " onMouseLeave={closeMenu}>
      {/* Main Categories */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((group) => {
          const active = activeCategory?.label === group.label;
          const hasChildren = (group.children?.length ?? 0) > 0;
          const icon = getCategoryIcon(group.label);

          return (
            <button
              key={group.label}
              type="button"
              onMouseEnter={() => openMenu(group)}
              className={`flex  cursor-pointer  items-center gap-1 rounded-t-lg px-2 pb-1 text-xs font-semibold transition ${
                active
                  ? "bg-[#f9f9fb] text-[#194891]"
                  : "bg-transparent text-slate-700 hover:bg-blue-50 hover:text-[#194891]"
              }`}
            >
              {/* Category Icon */}
              {icon && (
                // <span
                //   className={`${icon.bg} flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white [&>svg]:h-3 [&>svg]:w-3 [&>svg]:stroke-white`}
                // >
                //   {icon.icon}
                // </span>
                <span
                  className={`
                    flex h-6 w-6 bg-re shrink-0
                    items-center justify-center
                    rounded-md
                    ${icon.color}
                    [&>svg]:h-3.5
                    [&>svg]:w-3.5
                    [&>svg]:stroke-current
                `}
                >
                  {icon.icon}
                </span>
              )}

              {/* Category Name */}
              <span>{group.label}</span>

              {/* Dropdown Arrow */}
              {hasChildren && (
                <ChevronDown
                  size={13}
                  className={`transition-transform ${active ? "rotate-180" : ""}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Child Categories Dropdown */}
      {/* Child Categories Dropdown */}
      {activeCategory && (activeCategory.children?.length ?? 0) > 0 && (
        <div
          className="
          absolute
          left-58
          top-full
          z-50
          mt-0
          w-[75%]
          max-h-[420px]
          overflow-y-auto
          rounded-lg
          border
          border-slate-200
          bg-white
          p-6
          shadow-2xl
        "
          onMouseEnter={() => {
            if (closeTimer.current) {
              clearTimeout(closeTimer.current);
            }
          }}
          onMouseLeave={closeMenu}
        >
          <div className="grid grid-cols-2 gap-x-0 gap-y-1 lg:grid-cols-6">
            {activeCategory.children?.map((child) => {
              const childPath = child.themeId
                ? `/themes/${child.themeId}`
                : (child.productsUrl ?? "#");

              return (
                <div key={child.label} className="min-w-0 group">
                  {/* Parent Category */}

                  <Link
                    to={childPath}
                    state={{
                      categoryLabel: child.label,
                    }}
                    className="
                          mb-3
                          flex
                          items-center
                          gap-1
                          text-sm
                          font-mono
                          text-slate-800
                          transition
                          hover:text-[#194891]
                          "
                  >
                    {child.label}

                    {child.flag === "restricted" && (
                      <span
                        className="
                            rounded-full
                            bg-red-100
                            px-2
                            py-[2px]
                            text-[9px]
                            font-semibold
                            text-red-600
                            "
                      >
                        Restricted
                      </span>
                    )}
                  </Link>

                  {/* Child Items */}

                  <div className="space-y-1 ">
                    {child.children?.map((item) => (
                      <Link
                        key={item.label}
                        to={
                          item.themeId
                            ? `/themes/${item.themeId}`
                            : (item.productsUrl ?? "#")
                        }
                        state={{
                          categoryLabel: item.label,
                        }}
                        className="
                                flex
                                items-center
                                justify-between
                                rounded-md
                                px-2
                                py-1
                                text-xs
                                text-slate-600
                                transition-all
                                hover:bg-blue-50
                                hover:text-[#194891]
                                "
                      >
                        <span>{item.label}</span>

                        {item.flag === "restricted" && (
                          <span
                            className="
                                  ml-2
                                  rounded
                                  bg-red-50
                                  px-1.5
                                  py-0.5
                                  text-[8px]
                                  font-medium
                                  text-red-500
                                  "
                          >
                            ⚠
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
