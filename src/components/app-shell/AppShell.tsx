import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Bell,
  Camera,
  Heart,
  Search,
  Smartphone,
  HelpCircle,
  Phone,
  ScanQrCode,
} from "lucide-react";

import {
  AppSidebar,
  type SidebarItem,
} from "./AppSidebar";

import {
  LanguageProvider,
  type Language,
} from "../../contexts/LanguageContext";

const sidebarItems: SidebarItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "home",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: "chat",
  },
  {
    label: "Cart",
    href: "/cart",
    icon: "cart",
  },
  {
    label: "Track",
    href: "/track",
    icon: "track",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: "profile",
  },
];

const languageMeta: Record<
  Language,
  {
    label: string;
    flagSrc: string;
    alt: string;
  }
> = {
  en: {
    label: "EN",
    flagSrc: "/images/flags/uk.svg",
    alt: "English",
  },

  km: {
    label: "KH",
    flagSrc: "/images/flags/kh.webp",
    alt: "Khmer",
  },
};

type AppShellProps = {
  children: ReactNode;
  cartCount?: number;
};

export function AppShell({
  children,
  cartCount = 0,
}: AppShellProps) {
  const [showUtilityBar, setShowUtilityBar] =
    useState(true);

  const [language, setLanguage] =
    useState<Language>(() => {
      const savedLanguage =
        window.localStorage.getItem("app-language");

      return savedLanguage === "km"
        ? "km"
        : "en";
    });

  /*
   * Save selected language
   */
  useEffect(() => {
    window.localStorage.setItem(
      "app-language",
      language,
    );
  }, [language]);

  /*
   * Hide top utility bar while scrolling
   */
  useEffect(() => {
    const updateBarVisibility = () => {
      setShowUtilityBar(window.scrollY < 24);
    };

    updateBarVisibility();

    window.addEventListener(
      "scroll",
      updateBarVisibility,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateBarVisibility,
      );
    };
  }, []);

  const currentLanguage =
    languageMeta[language];

  const nextLanguage: Language =
    language === "en" ? "km" : "en";

  return (
    <LanguageProvider
      value={{
        language,
        setLanguage,
      }}
    >
      <div className="min-h-screen bg-[#fafafa] text-slate-800">
        {/* Sidebar */}

        <AppSidebar
          items={sidebarItems}
          cartCount={cartCount}
        />

        {/* Header */}

        <header className="fixed top-0 right-0 left-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur lg:left-20">
          {/* Utility Bar */}

          <div
            className={[
              "overflow-hidden border-b border-gray-200 bg-slate-50 transition-all duration-300 ease-out",

              showUtilityBar
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div
              className={[
                "mx-auto flex w-[98%] items-center justify-between gap-3 text-xs text-slate-500 transition-all duration-300",

                showUtilityBar
                  ? "py-2"
                  : "py-0",
              ].join(" ")}
            >
              {/* Left */}

              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="hidden items-center gap-1.5 md:inline-flex">
                  Welcome to E-Taobao from VTS
                  Company, Lyheng
                </span>

                <span className="hidden items-center gap-1.5 md:inline-flex">
                  <HelpCircle className="size-3.5" />

                  Support
                </span>
              </div>

              {/* Right */}

              <div className="hidden items-center gap-4 whitespace-nowrap sm:flex">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" />

                  Contact Us
                </span>

                {/* Language */}

                <button
                  type="button"
                  onClick={() =>
                    setLanguage(nextLanguage)
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
                  aria-label={`Switch language to ${
                    languageMeta[nextLanguage]
                      .label
                  }`}
                >
                  <img
                    src={
                      currentLanguage.flagSrc
                    }
                    alt={currentLanguage.alt}
                    width={18}
                    height={12}
                    className="rounded-xs"
                  />

                  <span>
                    {currentLanguage.label}
                  </span>
                </button>

                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="size-3.5" />

                  Get App
                </span>
              </div>
            </div>
          </div>

          {/* Main Header */}

          <div className="py-3">
            <div className="mx-auto flex w-[95%] items-center gap-2 sm:gap-3">
              {/* Mobile Logo */}

              <img
                src="https://play-lh.googleusercontent.com/5uVmNR71LD6-LHspJgdI4JGymI3qovFxlVtYHdPbSrJRPiRHyQkIxwYd_1bZqR8u5-5KJs3DE6NKJGMj6xSS"
                alt="Logo"
                width={40}
                height={40}
                className="shrink-0 rounded-xl lg:hidden"
              />

              {/* Search */}

              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-3 sm:px-4">
                <ScanQrCode className="mr-2 size-5 shrink-0" />

                <span className="mr-2 h-6 w-px bg-slate-300" />

                <Search className="size-4 shrink-0 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search products, brands, categories"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Search Image */}

              <button
                type="button"
                className="group relative flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-[#194891] via-[#245ca8] to-[#3b82d0] px-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(25,72,145,0.28)] transition-all duration-300 hover:-translate-y-0.5 md:px-4"
              >
                <Camera className="relative z-10 size-5" />

                <span className="relative z-10 hidden whitespace-nowrap md:inline">
                  Search by image
                </span>
              </button>

              {/* Wishlist */}

              <button
                type="button"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl transition hover:bg-slate-100"
              >
                <Heart className="size-5" />
              </button>

              {/* Notification */}

              <button
                type="button"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl transition hover:bg-slate-100"
              >
                <Bell className="size-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}

        <main className="pt-28 pb-20 lg:pl-20 lg:pb-0">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}