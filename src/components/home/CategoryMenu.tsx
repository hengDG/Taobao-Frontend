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
import type { CategoryGroup } from "@/types/taobao.types";

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
      <div className="flex flex-wrap gap-3">
        {categories.map((group) => {
          const active = activeCategory?.label === group.label;
          const hasChildren = (group.children?.length ?? 0) > 0;
          const icon = getCategoryIcon(group.label);

          return (
            <button
              key={group.label}
              type="button"
              onMouseEnter={() => openMenu(group)}
              className={`flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                active
                  ? "bg-[#194891]/10 text-[#194891]"
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
                    flex h-6 w-6 shrink-0
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
      {activeCategory && (activeCategory.children?.length ?? 0) > 0 && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          onMouseEnter={() => {
            if (closeTimer.current) {
              clearTimeout(closeTimer.current);
            }
          }}
          onMouseLeave={closeMenu}
        >
          <div className="flex flex-wrap gap-2">
            {activeCategory.children?.map((child) => {
              const childPath = child.themeId
                ? `/themes/${child.themeId}`
                : (child.productsUrl ?? "#");

              return (
                <Link
                  key={child.label}
                  to={childPath}
                  state={{
                    categoryLabel: child.label,
                  }}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#194891]"
                >
                  <span>{child.label}</span>

                  {child.flag && (
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] text-orange-600">
                      {child.flag}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
