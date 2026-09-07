import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import productService from "@/services/product/product.service";
import type { CategoryGroup } from "@/types/taobao.types";

const categoryIconMap: Record<string, string> = {
  fashion: "/categoryIcon/Fashion.png",
  "beauty & health": "/categoryIcon/Beauty & Health.png",
  "hobbies & gifts": "/categoryIcon/Hobbies & Gifts.png",
  "home & living": "/categoryIcon/Home & Living.png",
  "kitchen & dining": "/categoryIcon/Kitchen & Dining.png",
  pets: "/categoryIcon/Pets.png",
  "sports & outdoors": "/categoryIcon/Sports & Outdoors.png",
  "tools & hardware": "/categoryIcon/Tools & Hardware.png",
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
    <div className="relative" onMouseLeave={closeMenu}>
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
              className={`
                flex items-center cursor-pointer gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition
                ${
                  active
                    ? "bg-[#194891]/10 text-[#194891]"
                    : "bg-slate-100/0 text-slate-700 hover:bg-blue-50 hover:text-[#194891]"
                }
              `}
            >
              {icon && (
                <img
                  src={icon}
                  alt={group.label}
                  className="h-4 w-4 rounded-sm object-cover"
                />
              )}

              <span>{group.label}</span>

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
              const childIcon = getCategoryIcon(child.label);
              const childPath = child.themeId
                ? `/themes/${child.themeId}`
                : (child.productsUrl ?? "#");

              return (
                <Link
                  key={child.label}
                    to={childPath}
                //   to="theme"
                  state={{ categoryLabel: child.label }}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#194891]"
                >
                  <span className="inline-flex items-center gap-2 text-[11px]">
                    {childIcon && (
                      <img
                        src={childIcon}
                        alt={child.label}
                        className="h-4 w-4 rounded-sm object-cover"
                      />
                    )}

                    <span>{child.label}</span>
                  </span>

                  {child.flag && (
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px]  text-orange-600">
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
