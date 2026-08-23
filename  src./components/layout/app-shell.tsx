import { useEffect, useState } from "react";
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
import { AppSidebar, type SidebarItem } from "@/components/layout/app-sidebar";
import { LanguageProvider, type Language } from "@/components/language-context";

const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Chat", href: "/chat", icon: "chat" },
  { label: "Cart", href: "/cart", icon: "cart" },
  { label: "Track", href: "/track", icon: "track" },
  { label: "Profile", href: "/profile", icon: "profile" },
];

const languageMeta: Record<
  Language,
  { label: string; flagSrc: string; alt: string }
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
  children: React.ReactNode;
  cartCount?: number;
};

export function AppShell({ children, cartCount = 0 }: AppShellProps) {
  const [showUtilityBar, setShowUtilityBar] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const savedLanguage = window.localStorage.getItem("app-language");
    return savedLanguage === "km" ? "km" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("app-language", language);
  }, [language]);

  useEffect(() => {
    const updateBarVisibility = () => {
      setShowUtilityBar(window.scrollY < 24);
    };

    updateBarVisibility();
    window.addEventListener("scroll", updateBarVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateBarVisibility);
  }, []);

  const currentLanguage = languageMeta[language];
  const nextLanguage: Language = language === "en" ? "km" : "en";

  return (
    <LanguageProvider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-[#fafafa] text-slate-800">
        <AppSidebar items={sidebarItems} cartCount={cartCount} />

        <header className="fixed top-0 right-0 left-0 z-20 border-b border-border bg-white/95 backdrop-blur lg:left-20">
          <div
            className={`overflow-hidden border-b border-border/70 bg-muted transition-all duration-300 ease-out ${
              showUtilityBar ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`mx-auto flex w-[98%] items-center justify-between gap-3 text-xs text-muted-foreground transition-all duration-300 ${
                showUtilityBar ? "py-2" : "py-0"
              }`}
            >
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="hidden items-center gap-1.5 md:inline-flex">
                  Welcome to E-Taobao from VTS Company, Lyheng
                </span>

                <span className="hidden items-center gap-1.5 md:inline-flex">
                  <HelpCircle className="size-3.5" />
                  Support
                </span>
              </div>

              <div className="hidden items-center gap-4 whitespace-nowrap sm:flex">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" />
                  Contact Us
                </span>

                <button
                  type="button"
                  onClick={() => setLanguage(nextLanguage)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/70 bg-white px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                  aria-label={`Switch language to ${languageMeta[nextLanguage].label}`}
                  title={`Switch language to ${languageMeta[nextLanguage].label}`}
                >
                  <img
                    src={currentLanguage.flagSrc}
                    alt={currentLanguage.alt}
                    width={18}
                    height={12}
                    className="rounded-xs"
                  />
                  <span>{currentLanguage.label}</span>
                </button>

                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="size-3.5" />
                  Get App
                </span>
              </div>
            </div>
          </div>

          <div className="cursor-pointer py-3">
            <div className="mx-auto flex w-[95%] items-center gap-2 sm:gap-3">
              <img
                src="https://play-lh.googleusercontent.com/5uVmNR71LD6-LHspJgdI4JGymI3qovFxlVtYHdPbSrJRPiRHyQkIxwYd_1bZqR8u5-5KJs3DE6NKJGMj6xSS"
                alt="Logo"
                width={40}
                height={40}
                className="shrink-0 rounded-xl lg:hidden"
              />

              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-muted px-3 py-3 sm:px-4">
                <ScanQrCode className="mr-2 size-5 shrink-0" />
                <span className="mr-2 h-6 w-px bg-[#cbd5e1]" />
                <Search className="size-4 shrink-0 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search products, brands, categories"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <button
                type="button"
                className="group relative flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-[#194891] via-[#245ca8] to-[#3b82d0] px-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(25,72,145,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(25,72,145,0.4)] active:translate-y-0 active:scale-[0.97] md:px-4"
                aria-label="Search by image"
                title="Search by image"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/20 blur-sm transition-all duration-700 group-hover:left-[120%]"
                />
                <Camera className="relative z-10 size-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10 hidden whitespace-nowrap md:inline">
                  Search by image
                </span>
              </button>

              <button
                type="button"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl transition-colors hover:bg-muted"
                aria-label="Wishlist"
              >
                <Heart className="size-5" />
              </button>

              <button
                type="button"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl transition-colors hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="pt-28 lg:pl-20">{children}</div>
      </div>
    </LanguageProvider>
  );
}
