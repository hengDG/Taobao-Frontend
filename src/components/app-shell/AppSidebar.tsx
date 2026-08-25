import { Link, useLocation } from "react-router-dom";
import {
  House,
  MessageCircleMore,
  ShoppingCart,
  Package,
  UserRound,
} from "lucide-react";

const iconMap = {
  home: House,
  chat: MessageCircleMore,
  cart: ShoppingCart,
  track: Package,
  profile: UserRound,
} as const;

export type SidebarItem = {
  label: string;
  href: string;
  icon: keyof typeof iconMap;
};

type AppSidebarProps = {
  items: SidebarItem[];
  cartCount?: number;
};

export function AppSidebar({
  items,
  cartCount = 0,
}: AppSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 border-r border-gray-200 bg-white lg:flex lg:flex-col lg:items-center lg:py-4">
        {/* Logo */}
        <div className="mb-6 grid size-10 place-items-center">
          <img
            src="https://play-lh.googleusercontent.com/5uVmNR71LD6-LHspJgdI4JGymI3qovFxlVtYHdPbSrJRPiRHyQkIxwYd_1bZqR8u5-5KJs3DE6NKJGMj6xSS"
            // src="/public/vtslogo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-xl"
          />
        </div>

        {/* Navigation */}
        <nav className="flex w-full flex-1 flex-col items-center gap-2">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            const isCart = item.icon === "cart";
            const Icon = iconMap[item.icon] ?? House;

            return (
              <Link
                key={item.href}
                to={item.href}
                aria-label={item.label}
                data-cart-target={isCart ? "true" : undefined}
                className={[
                  "group relative flex w-14 items-center justify-center rounded-2xl py-3 transition-all duration-300",

                  isCart
                    ? "overflow-visible border border-white/20 bg-gradient-to-br from-[#194891] via-[#245ca8] to-[#3b82d0] text-white shadow-[0_8px_24px_rgba(25,72,145,0.28)] hover:-translate-y-0.5"
                    : isActive
                      ? "bg-blue-50 text-[#2064d1]"
                      : "text-slate-700 hover:bg-slate-100",

                  isCart && isActive
                    ? "ring-2 ring-[#7fb1ff]/70 ring-offset-1"
                    : "",
                ].join(" ")}
              >
                {isCart && (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10 opacity-0"
                    data-cart-flash="true"
                  />
                )}

                <span
                  className="relative z-10"
                  data-cart-icon={isCart ? "true" : undefined}
                >
                  <Icon className="size-5 shrink-0" />
                </span>

                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2.5 right-0 z-30 inline-flex min-w-5 translate-x-1/3 items-center justify-center rounded-full bg-[#ff4d00] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white px-4 py-2 lg:hidden">
        <ul
          className="mx-auto grid max-w-md gap-2"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            const isCart = item.icon === "cart";

            const Icon = iconMap[item.icon] ?? House;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  aria-label={item.label}
                  className={[
                    "group relative flex items-center justify-center rounded-xl py-3 transition-all duration-300",

                    isCart
                      ? "overflow-visible bg-gradient-to-br from-[#194891] via-[#245ca8] to-[#3b82d0] text-white shadow-lg"
                      : isActive
                        ? "bg-blue-50 text-[#2064d1]"
                        : "text-slate-700 hover:bg-slate-100",

                    isCart && isActive
                      ? "ring-2 ring-[#7fb1ff]/70 ring-offset-1"
                      : "",
                  ].join(" ")}
                >
                  <Icon className="relative z-10 size-5 shrink-0" />

                  {isCart && cartCount > 0 && (
                    <span className="absolute -top-2 right-0 z-30 inline-flex min-w-5 translate-x-1/3 items-center justify-center rounded-full bg-[#ff4d00] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}