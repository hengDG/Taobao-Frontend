import {
  Bell,
  Heart,
  Search,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search products..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:flex"
          >
            <Heart className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
              0
            </span>
          </Link>

          {/* Language */}
          <button
            type="button"
            className="ml-1 hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex"
          >
            🇬🇧
            <span>EN</span>
          </button>

          {/* Avatar */}
          <Link
            to="/profile"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600"
          >
            SK
          </Link>
        </div>
      </div>
    </header>
  );
}