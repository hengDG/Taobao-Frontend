import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import "@/styles/index.css";
import {
  Bell,
  Camera,
  Heart,
  Search,
  HelpCircle,
  ScanQrCode,
  ChevronDown,
  ShoppingCart,
  Handbag,
  Cable,
  MirrorRound,
  HouseHeart,
  SportShoe,
  Map,
  Baby,
  Gem,
  Car,
  PawPrint,
  X,
  SwitchCamera,
  PackageCheck,
  UserRound,
} from "lucide-react";

import { useLocation, useNavigate, Link } from "react-router-dom";

import { AppSidebar, type SidebarItem } from "./AppSidebar";
import { Footer } from "./Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

import {
  LanguageProvider,
  type Language,
} from "../../contexts/LanguageContext";
import { extractProductUrl } from "@/utils/extractProductUrl";

const sidebarItems: SidebarItem[] = [
  {
    label: "",
    href: "/",
    icon: "home",
  },
  {
    label: "",
    href: "/chat",
    icon: "chat",
  },
  {
    label: "",
    href: "/cart",
    icon: "cart",
  },
  {
    label: "",
    href: "/track",
    icon: "track",
  },
  {
    label: "",
    href: "/profile",
    icon: "profile",
  },
];

const promoBanners = [
  {
    key: "promo-a",
    badge: "🎁",
    accent: "🎉",
    title: "Super 88",
    subtitle: "On Sale Now!",
    highlight: "Big Discount Coupons from 30% Off",
    button: "Shop Now",
    tint: "from-[#ff6a88] via-[#ff7b7f] to-[#ffb26b]",
  },
  {
    key: "promo-b",
    badge: "🔥",
    accent: "⚡",
    title: "Flash Sale",
    subtitle: "New User Exclusive!",
    highlight: "Discount Coupons from 20% Off",
    button: "Claim Now",
    tint: "from-[#2f7ef7] via-[#4ea7ff] to-[#6ee7b7]",
  },
] as const;

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

export function AppShell({ children, cartCount = 0 }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUtilityBar, setShowUtilityBar] = useState(true);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  const [showImageSearch, setShowImageSearch] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageSearching, setImageSearching] = useState(false);

  const [foundProducts, setFoundProducts] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const searchExamples = [
    {
      // category: "Pet",
      child: "Search by link ...",
      color: "bg-green-500 text-white",
    },
    {
      child: "Search by category ...",
    },
    {
      child: "Search by product keywords ...",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Handbag className="w-3 h-3" />
          Fashion
        </span>
      ),
      child: "T-Shirt",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Handbag className="w-3 h-3" />
          Fashion
        </span>
      ),
      child: "Sneakers",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Handbag className="w-3 h-3" />
          Fashion
        </span>
      ),
      child: "Jackets",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Cable className="w-3 h-3" />
          Electronics
        </span>
      ),
      child: "iPhone",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Cable className="w-3 h-3" />
          Electronics
        </span>
      ),
      child: "Smart Watch",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Cable className="w-3 h-3" />
          Electronics
        </span>
      ),
      child: "Earbuds",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <MirrorRound className="w-3 h-3" />
          Beauty
        </span>
      ),
      child: "Skincare",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <MirrorRound className="w-3 h-3" />
          Beauty
        </span>
      ),
      child: "Perfume",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <HouseHeart className="w-3 h-3" />
          Home
        </span>
      ),
      child: "Sofa",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <HouseHeart className="w-3 h-3" />
          Home
        </span>
      ),
      child: "Kitchen Tools",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <HouseHeart className="w-3 h-3" />
          Home
        </span>
      ),
      child: "Decoration",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <SportShoe className="w-3 h-3" />
          Sports
        </span>
      ),
      child: "Running Shoes",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <SportShoe className="w-3 h-3" />
          Sports
        </span>
      ),
      child: "Fitness Gear",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Map className="w-3 h-3" />
          Travel
        </span>
      ),
      child: "Backpack",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Map className="w-3 h-3" />
          Travel
        </span>
      ),
      child: "Suitcase",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Baby className="w-3 h-3" />
          Toys
        </span>
      ),
      child: "Toys",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Baby className="w-3 h-3" />
          Baby
        </span>
      ),
      child: "Baby Clothes",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Gem className="w-3 h-3" />
          Jewelry
        </span>
      ),
      child: "Necklace",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <Car className="w-3 h-3" />
          Automotive
        </span>
      ),
      child: "Car Accessories",
      color: "bg-green-500 text-white",
    },
    {
      category: (
        <span className="flex items-center gap-1">
          <PawPrint className="w-3 h-3" />
          Pet
        </span>
      ),
      child: "Pet Supplies",
      color: "bg-green-500 text-white",
    },
  ];
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchFocused, setSearchFocused] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const currentSearchExample = searchExamples[placeholderIndex];
  const [searchText, setSearchText] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("keyword") ?? params.get("url") ?? "";
  });

  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = window.localStorage.getItem("app-language");

    return savedLanguage === "km" ? "km" : "en";
  });

  /*
   * Save selected languageF
   */
  useEffect(() => {
    window.localStorage.setItem("app-language", language);
  }, [language]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") ?? params.get("url") ?? "";
    setSearchText(keyword);
  }, [location.search]);
  useEffect(() => {
    if (hasStartedTyping || searchFocused) {
      return;
    }

    const currentText = searchExamples[placeholderIndex].child;
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && placeholderText.length < currentText.length) {
      timeout = setTimeout(() => {
        setPlaceholderText(
          currentText.substring(0, placeholderText.length + 1),
        );
      }, 70); //typing speed
    } else if (isDeleting && placeholderText.length > 0) {
      timeout = setTimeout(() => {
        setPlaceholderText(
          currentText.substring(0, placeholderText.length - 1),
        );
      }, 35); //delete speed
    } else if (!isDeleting && placeholderText.length === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500); // pause before deleting
    } else if (isDeleting && placeholderText.length === 0) {
      setIsDeleting(false);

      setPlaceholderIndex((prev) => (prev + 1) % searchExamples.length);
    }

    return () => clearTimeout(timeout);
  }, [
    placeholderText,
    isDeleting,
    placeholderIndex,
    hasStartedTyping,
    searchFocused,
  ]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = searchText.trim() || currentSearchExample.child.trim();
    if (!value) {
      return;
    }

    const extractedUrl = extractProductUrl(value);

    const params = new URLSearchParams({
      page: "1",
      size: "20",
    });

    if (extractedUrl) {
      params.set("url", extractedUrl);
    } else {
      params.set("keyword", value);
    }

    setSearchText("");
    setSearchFocused(false);
    setHasStartedTyping(false);

    // remove old input composition
    requestAnimationFrame(() => {
      const input =
        document.querySelector<HTMLInputElement>("input[type='text']");

      if (input) {
        input.value = "";
        input.blur();
      }
    });

    setPlaceholderText("");
    setIsDeleting(false);

    setPlaceholderIndex((prev) => (prev + 1) % searchExamples.length);

    setTimeout(() => {
      navigate(`/products?${params.toString()}`);
    }, 900);
  };

  /*
   * Hide top utility bar while scrolling
   */
  useEffect(() => {
    const updateBarVisibility = () => {
      setShowUtilityBar(window.scrollY < 24);
    };

    updateBarVisibility();

    window.addEventListener("scroll", updateBarVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateBarVisibility);
    };
  }, []);

  const currentLanguage = languageMeta[language];

  const nextLanguage: Language = language === "en" ? "km" : "en";

  // Compact header state when user scrolls down
  const isCompact = !showUtilityBar;
  const isHomePage = location.pathname === "/";
  const shouldShowPromoBanner = isHomePage && showPromoBanner && showUtilityBar;

  useEffect(() => {
    if (!isHomePage || !showUtilityBar) {
      return;
    }

    const interval = window.setInterval(() => {
      setActivePromoIndex((current) => (current + 1) % promoBanners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isHomePage, showUtilityBar]);

  /*
   * Handle image upload for image search
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImagePreview(preview);

    // auto search
    processImageSearch();
  };

  const processImageSearch = () => {
    setImageSearching(true);

    setFoundProducts(null);

    // simulate AI search

    setTimeout(() => {
      setImageSearching(false);

      setFoundProducts(10);
    }, 2000);
  };
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      streamRef.current = stream;

      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.log(error);

      alert("Camera permission denied");
    }
  };
  const takePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/jpeg");

    // stop camera

    streamRef.current?.getTracks().forEach((track) => track.stop());

    setImagePreview(imageUrl);

    setCameraOpen(false);

    // auto search
    processImageSearch();
  };
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());

    setCameraOpen(false);
  };
  const resetImageSearch = () => {
    setImagePreview(null);

    setFoundProducts(null);

    setImageSearching(false);
  };
  return (
    <LanguageProvider
      value={{
        language,
        setLanguage,
      }}
    >
      <div className="min-h-screen bg-[#ffffff] text-slate-800">
        <ScrollToTopButton />

        {/* Sidebar */}

        <AppSidebar items={sidebarItems} cartCount={cartCount} />

        {/* Header */}

        <header className="fixed top-0 left-0 right-0 z-20 px-3 sm:px-4 bg-white/60 backdrop-blur-md">
          {" "}
          {/* Utility Bar */}
          {/* <div
            className={[
              "overflow-hidden  border-gray-200 bg-transparent transition-all duration-300 ease-out",

              showUtilityBar ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div
              className={[
                "mx-auto flex w-[98%] items-center justify-between gap-3 text-xs text-slate-500 transition-all duration-300",

                showUtilityBar ? "py-2" : "py-0",
              ].join(" ")}
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

              <div className="items-center hidden gap-4 whitespace-nowrap sm:flex">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" />
                  Contact Us
                </span>


                <button
                  type="button"
                  onClick={() => setLanguage(nextLanguage)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
                  aria-label={`Switch language to ${
                    languageMeta[nextLanguage].label
                  }`}
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
          </div> */}
          {/* Utility Bar */}
          <div
            className={[
              "overflow-hidden  border-gray-100 bg-white transition-all duration-300 ease-out",
              showUtilityBar ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div
              className="
                mx-auto
                flex
                h-8
                w-[95%]
                items-center
                justify-between
                text-[10px]
                text-slate-600
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-5 whitespace-nowrap">
                {/* Welcome */}
                <span className="hidden md:inline-flex">
                  Welcome to VTS Express Mall
                </span>

                <span
                  className="
          cursor-pointer
          hover:text-[#194891]
        "
                >
                  Privacy
                </span>

                <span
                  className="
          cursor-pointer
          hover:text-[#194891]
        "
                >
                  About Us
                </span>

                <span
                  className="
          cursor-pointer
          hover:text-[#194891]
        "
                >
                  Policy
                </span>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-5 whitespace-nowrap">
                {/* Orders */}
                <span
                  className="
          flex
          cursor-pointer
          items-center
          gap-1
          hover:text-[#194891]
        "
                >
                  My Orders
                  <ChevronDown className="size-3" />
                </span>

                {/* Cart */}
                <span
                  className="
          flex
          cursor-pointer
          items-center
          gap-1
          hover:text-[#194891]
        "
                >
                  <ShoppingCart className="size-3.5 text-[#ff5000]" />
                  Cart
                  <ChevronDown className="size-3" />
                </span>

                {/* Recently Viewed */}
                <span
                  className="
          cursor-pointer
          hover:text-[#194891]
        "
                >
                  Recently Viewed
                </span>

                {/* Support */}
                <span
                  className="
          flex
          cursor-pointer
          items-center
          gap-1
          hover:text-[#194891]
        "
                >
                  <HelpCircle className="size-3.5" />
                  Support
                </span>

                {/* Help */}
                <span
                  className="
          flex
          cursor-pointer
          items-center
          gap-1
          hover:text-[#194891]
        "
                >
                  Help
                  <ChevronDown className="size-3" />
                </span>

                {/* Language - Keep your existing logic */}
                <button
                  type="button"
                  onClick={() => setLanguage(nextLanguage)}
                  className="
          flex
          cursor-pointer
          items-center
          gap-1.5
          transition
          hover:text-[#194891]
        "
                  aria-label={`Switch language to ${
                    languageMeta[nextLanguage].label
                  }`}
                >
                  <img
                    src={currentLanguage.flagSrc}
                    alt={currentLanguage.alt}
                    width={18}
                    height={12}
                    className="rounded-xs"
                  />

                  <span>{currentLanguage.label}</span>

                  <ChevronDown className="size-3" />
                </button>
              </div>
            </div>
          </div>
          {/* Promo Banner */}
          <div
            className={[
              "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-l from-[#235BA7] via-[#3B82F6] to-[#4483d1] transition-all duration-300 ease-out",
              shouldShowPromoBanner
                ? "max-h-11 opacity-100"
                : "max-h-1 opacity-0",
            ].join(" ")}
          >
            <div className="relative w-full overflow-hidden h-11">
              {promoBanners.map((banner, index) => {
                const isActive = index === activePromoIndex;

                return (
                  <div
                    key={banner.key}
                    className={[
                      "absolute inset-0 flex items-center justify-center px-3 py-2.5 transition-all duration-700 ease-in-out sm:px-6",
                      `bg-gradient-to-r ${banner.tint}`,
                      isActive
                        ? "translate-y-0 opacity-100 scale-100"
                        : index === (activePromoIndex + 1) % promoBanners.length
                          ? "-translate-y-full opacity-0 scale-95"
                          : "translate-y-full opacity-0 scale-95",
                    ].join(" ")}
                    style={{
                      transform: isActive
                        ? "translateY(0) scale(1)"
                        : index === (activePromoIndex + 1) % promoBanners.length
                          ? "translateY(-100%) scale(0.96)"
                          : "translateY(100%) scale(0.96)",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <div className="flex items-center gap-4 text-[#fafbff]">
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd8e5]/80 text-lg shadow-sm">
                          {banner.badge}
                        </span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff2b8]/80 text-lg shadow-sm">
                          {banner.accent}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-center text-[9px] font-semibold tracking-wide sm:text-[11px]">
                        <span className="text-white/95">{banner.title}</span>
                        <span className="text-[#fff0f4]">
                          {banner.subtitle}
                        </span>
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[#fffafc]">
                          {banner.highlight}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="ml-2 inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/90 px-5 py-1 text-[11px] font-semibold text-[#0c1e87] shadow-sm transition hover:bg-white"
                      >
                        {banner.button}
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setShowPromoBanner(false)}
                aria-label="Close promotional banner"
                className="absolute right-4 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md  text-lg font-light text-[#223fa8] transition hover:bg-[#e02914] hover:text-white sm:right-6"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>
          {/* Main Header */}
          {/* Main Header */}
          <div className="pt-2">
            <div
              className="
      mx-auto
      flex
      w-full
      max-w-[1500px]
      items-center
      gap-4
      px-4
      sm:px-6
      lg:px-8
      justify-between
    "
            >
              {/* Logo */}
              <Link to="/" className="shrink-0">
                <img
                  src="/vtslogo.jpg"
                  alt="Logo"
                  width={isCompact ? 90 : 110}
                  height={isCompact ? 90 : 110}
                  className="hidden transition-all duration-300 rounded-xl lg:block"
                />

                <img
                  src="/vtslogo.jpg"
                  alt="Logo"
                  width={64}
                  height={64}
                  className=" rounded-xl lg:hidden"
                />
              </Link>

              {/* Search */}
              <div className="hidden w-[70%]   lg:block">
                <form
                  onSubmit={handleSearchSubmit}
                  className="
          flex
          h-12
          w-full
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white/70
          px-4
          shadow-sm
          backdrop-blur-md
          transition
          focus-within:border-[#194891]/40
          focus-within:bg-white
          focus-within:shadow-md
        "
                >
                  <ScanQrCode className=" size-5 shrink-0 text-slate-500" />

                  <span className="w-px h-5 bg-slate-300" />

                  <Search className=" size-5 shrink-0 text-slate-400" />

                  <div className="relative flex-1 min-w-0">
                    {!searchText && !hasStartedTyping && (
                      <div className="absolute inset-0 flex items-center text-sm pointer-events-none ">
                        <span className="truncate text-slate-400">
                          {placeholderText}
                        </span>
                      </div>
                    )}

                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchText}
                      onFocus={() => {
                        setSearchFocused(true);
                        setPlaceholderText(currentSearchExample.child);
                      }}
                      onBlur={() => {
                        setSearchFocused(false);

                        if (!searchText) {
                          setPlaceholderText("");
                          setHasStartedTyping(false);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        setSearchText(value);
                        setSearchFocused(true);
                        setHasStartedTyping(value.length > 0);
                      }}
                      className="w-full h-full text-sm bg-transparent outline-none "
                    />
                  </div>

                  {/* Camera */}
                  <button
                    type="button"
                    onClick={() => setShowImageSearch(true)}
                    className="
            rounded-lg
            p-2
            text-slate-400
            transition
            hover:bg-blue-50
            hover:text-[#194891]
          "
                  >
                    <Camera className="size-5" />
                  </button>

                  <button
                    type="submit"
                    className="
            rounded-xl
            bg-[#235BA7]
            px-5
            py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-[#194891]
          "
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Right Actions */}
              <div className="items-center hidden gap-8 shrink-0 lg:flex">
                <button className="header-action">
                  <ShoppingCart className="size-5" />
                </button>

                <button className="header-action">
                  <Heart className="size-5" />
                </button>

                <button
                  onClick={() => navigate("/track")}
                  className="header-action"
                >
                  <PackageCheck className="size-5" />
                </button>

                <button className="header-action">
                  <UserRound className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}

        <main
          className={`
            ${shouldShowPromoBanner ? "mt-10" : "0"}
            pt-28
            pb-20
            lg:pb-0
            mx-auto
            w-full
            max-w-[1600px]
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            xl:px-14
            2xl:px-18
          `}
        >
          {children}
        </main>

        <Footer />
      </div>

      {/* Search By Image Modal */}
    </LanguageProvider>
  );
}
