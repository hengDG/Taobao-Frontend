"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  MessageCircleMore,
  Package,
  ShoppingCart,
  Trash,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { motion } from "motion/react";

const iconMap = {
  home: House,
  chat: MessageCircleMore,
  cart: ShoppingCart,
  track: Package,
  profile: UserRound,
  trash: Trash,
} as const;

type SidebarIcon = keyof typeof iconMap;

export type SidebarItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
};

type AppSidebarProps = {
  items: SidebarItem[];
};

export function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();
  const selectedCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 border-r border-border bg-white lg:flex lg:flex-col lg:items-center lg:py-4">
        <div className="mb-6 grid size-10 place-items-center rounded-full bg-red-600 text-lg font-bold text-white">
          <Image
            src="https://play-lh.googleusercontent.com/5uVmNR71LD6-LHspJgdI4JGymI3qovFxlVtYHdPbSrJRPiRHyQkIxwYd_1bZqR8u5-5KJs3DE6NKJGMj6xSS"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-xl"
          />
        </div>

        <nav className="flex w-full flex-1 flex-col items-center gap-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const isCart = item.icon === "cart";
            const Icon = iconMap[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                data-cart-target={isCart ? "true" : undefined}
                className={cn(
                  "group relative flex w-14 items-center justify-center rounded-2xl py-3 transition-all duration-300",
                  isCart
                    ? "overflow-visible border border-white/20 bg-linear-to-br from-[#194891] via-[#245ca8] to-[#3b82d0] text-white shadow-[0_8px_24px_rgba(25,72,145,0.28)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(25,72,145,0.4)] active:translate-y-0 active:scale-[0.97]"
                    : isActive
                      ? " text-[#2064d1]"
                      : "text-foreground hover:bg-muted",
                  isCart &&
                    isActive &&
                    "ring-2 ring-[#7fb1ff]/70 ring-offset-1",
                )}
              >
                {isCart ? (
                  <motion.div data-cart-icon="true" className="relative z-10">
                    <Icon className="size-5 shrink-0" />
                  </motion.div>
                ) : (
                  <Icon className="relative z-10 size-5 shrink-0" />
                )}

                {isCart && selectedCount > 0 ? (
                  <motion.span
                    key={selectedCount}
                    data-cart-badge="true"
                    initial={{
                      scale: 0.6,
                      y: 4,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                    animate={{
                      scale: [0.6, 1.5, 0.9, 1],
                      // y: [4, -5, 1, 0],
                    }}
                    className="
                      absolute -top-2.5 right-0 z-30
                      inline-flex min-w-5 translate-x-1/3
                      items-center justify-center
                      rounded-full bg-[#ff4d00]
                      px-1.5 py-0.5
                      text-[10px] font-semibold leading-none
                      text-white shadow-sm
                    "
                  >
                    {selectedCount > 99 ? "99+" : selectedCount}
                  </motion.span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white px-4 py-2 lg:hidden">
        <ul
          className="mx-auto grid max-w-md gap-2"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) => {
            const isActive = pathname === item.href;
            const isCart = item.icon === "cart";
            const Icon = iconMap[item.icon];

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-cart-target={isCart ? "true" : undefined}
                  className={cn(
                    "group relative flex items-center justify-center rounded-xl py-3 transition-all duration-300",
                    isCart
                      ? "overflow-visible border border-white/20 bg-linear-to-br from-[#194891] via-[#245ca8] to-[#3b82d0] text-white shadow-[0_8px_20px_rgba(25,72,145,0.26)]"
                      : isActive
                        ? "bg-white text-[#2064d1]"
                        : "text-foreground hover:bg-muted",
                    isCart &&
                      isActive &&
                      "ring-2 ring-[#7fb1ff]/70 ring-offset-1",
                  )}
                  aria-label={item.label}
                >
                  {isCart ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/20 to-transparent"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/20 blur-sm transition-all duration-700 group-hover:left-[120%]"
                      />
                    </>
                  ) : null}

                  {isCart ? (
                    <motion.div
                      key={selectedCount}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: [1, 1.35, 0.9, 1.12, 1],
                        rotate: [0, -8, 8, -4, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="relative z-10"
                    >
                      <Icon className="size-5 shrink-0" />
                    </motion.div>
                  ) : (
                    <Icon
                      className={cn(
                        "relative z-10 size-5 shrink-0 transition-transform duration-300",
                      )}
                    />
                  )}

                  {isCart && selectedCount > 0 ? (
                    <span className="absolute -top-2.5 right-0 z-30 inline-flex min-w-5 translate-x-1/3 items-center justify-center rounded-full bg-[#ff4d00] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm">
                      {selectedCount > 99 ? "99+" : selectedCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
