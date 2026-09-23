import { Star, Eye, ShoppingBag, ChevronRight, Flame } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import image1 from "/slideImage/longslide1.png";
import image2 from "/slideImage/longslide2.png";
import image3 from "/slideImage/longslide3.png";
import image4 from "/slideImage/longslide4.png";
import image5 from "/slideImage/longslide5.png";
import { products } from "@/data/products";
import CategoryMenu from "@/components/home/CategoryMenu";
import productService from "@/services/product/product.service";
import type { TaobaoProduct } from "@/shared/types";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  bgClass: string;
  image?: string;
};

const slides: Slide[] = [
  {
    id: "slide-1",
    title: "NIKE Official Flagship ",
    subtitle: "The selected type is ready",
    bgClass: "bg-gradient-to-r from-[#37b97f] to-[#5ec47c]",
    image: image1,
  },
  {
    id: "slide-2",
    title: "Top Home Living Picks",
    subtitle: "Trusted quality and fast shipping",
    bgClass: "bg-gradient-to-r from-[#3b82d6] to-[#5d8df0]",
    image: image2,
  },
  {
    id: "slide-3",
    title: "Beauty & Daily ",
    subtitle: "Hot products updated every day",
    bgClass: "bg-gradient-to-r from-[#6c63ff] to-[#8c7dff]",
    image: image3,
  },
  {
    id: "slide-4",
    title: "Home Essentials",
    subtitle: "Everything you need for your home",
    bgClass: "bg-gradient-to-r from-[#ff7e5f] to-[#feb47b]",
    image: image4,
  },
  {
    id: "slide-5",
    title: "Fashion & Accessories",
    subtitle: "Stay trendy with our latest collection",
    bgClass: "bg-gradient-to-r from-[#ff6a88] to-[#ff99ac]",
    image: image5,
  },
];

const formatPriceText = (value: number | string | null | undefined) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString("en-US") : "0";
  }

  if (typeof value === "string") {
    return value.trim() || "0";
  }

  return "0";
};

const HotDealTile = ({ product }: { product: TaobaoProduct }) => {
  const khrDisplayValue = formatPriceText(
    product.price?.khr ?? product.priceKhr,
  );
  const usdPriceText = product.price?.usd || "Price on request";

  return (
    <div className="group rounded-lg border border-slate-100 bg-white p-1 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="overflow-hidden bg-white rounded-t-lg">
        <img
          src={
            product.image ||
            "https://placehold.co/600x600/edf2f7/475569?text=Product"
          }
          alt={product.title || "Hot deal product"}
          className="object-cover w-full overflow-hidden transition-transform duration-300 h-30 group-hover:scale-105"
        />
      </div>

      <div className="flex items-end justify-between gap-0 pl-1 mt-2">
        <div className="mt-0.5 flex flex-col items-start gap-0 leading-none">
          <div className="text-[13px] font-bold leading-none text-[#194891]">
            KHR {khrDisplayValue}
          </div>

          <div className="mt-0 text-[10px] leading-4 text-slate-400">
            USD {usdPriceText}
          </div>
        </div>

        {product.soldLabel ? (
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-gray-400">
              {product.soldLabel} sold
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const categories = [
  {
    name: "Fashion",
    image: "/categoryIcon/icon/fashion.png",
    children: [
      "Women",
      "Men",
      "Kids",
      "Accessories",
      "Shoes",
      "Luxury",
      "Streetwear",
      "Sale Picks",
    ],
  },
  {
    name: "Beauty",
    image: "/categoryIcon/icon/beauty.png",
    children: [
      "Skincare",
      "Makeup",
      "Hair Care",
      "Body Care",
      "Perfume",
      "Wellness",
      "Tools",
      "Popular",
    ],
  },
  {
    name: "Hobbies",
    image: "/categoryIcon/icon/hobby.png",
    children: [
      "DIY",
      "Collectibles",
      "Crafts",
      "Games",
      "Stationery",
      "Art Supplies",
      "Gifts",
      "New Arrivals",
    ],
  },
  {
    name: "Home",
    image: "/categoryIcon/icon/home.png",
    children: [
      "Furniture",
      "Bedding",
      "Decor",
      "Lighting",
      "Storage",
      "Textiles",
      "Living Room",
      "Bedroom",
    ],
  },
  {
    name: "Kitchen",
    image: "/categoryIcon/icon/kitchen.png",
    children: [
      "Cookware",
      "Dining",
      "Appliances",
      "Storage",
      "Cleaning",
      "Tableware",
      "Bistro",
      "Best Sellers",
    ],
  },
  {
    name: "Pet",
    image: "/categoryIcon/icon/pet.png",
    children: [
      "Dog Food",
      "Cat Food",
      "Toys",
      "Grooming",
      "Beds",
      "Travel",
      "Health",
      "Accessories",
    ],
  },
  {
    name: "Sport",
    image: "/categoryIcon/icon/sport.png",
    children: [
      "Running",
      "Cycling",
      "Training",
      "Fitness",
      "Outdoor",
      "Balls",
      "Travel Gear",
      "Essentials",
    ],
  },
  {
    name: "Tools",
    image: "/categoryIcon/icon/tool.png",
    children: [
      "Power Tools",
      "Hand Tools",
      "Safety",
      "Hardware",
      "Home Repair",
      "Garden",
      "Smart Tools",
      "Workshop",
    ],
  },
  {
    name: "More",
    image: "/categoryIcon/icon/more.png",
    children: [
      "Featured",
      "Bundles",
      "Daily Deals",
      "Flash Sale",
      "Trending",
      "Fresh Finds",
      "Popular",
      "Top Rated",
    ],
  },
];

export function HomeMarketplaceDashboard() {
  const [pickProducts, setPickProducts] = useState<TaobaoProduct[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeOrder, setActiveOrder] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const orders = [
    {
      image: products[0]?.imageUrl,
      status: "Shipping",
      date: "09-02",
      message: "Package arrived at China warehouse",
    },
    {
      image: products[1]?.imageUrl,
      status: "Paid",
      date: "09-01",
      message: "Waiting seller to prepare your order",
    },
    {
      image: products[2]?.imageUrl,
      status: "Cambodia",
      date: "08-30",
      message: "Package arrived in Cambodia",
    },
    {
      image: products[3]?.imageUrl,
      status: "Delivered",
      date: "08-28",
      message: "Order delivered successfully",
    },
  ];

  // clone first item
  const userOrders = [...orders, orders[0]];
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOrder((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeOrder === orders.length) {
      const timer = setTimeout(() => {
        setEnableTransition(false);

        setActiveOrder(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setEnableTransition(true);
          });
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [activeOrder]);

  useEffect(() => {
    if (!slides.length) return;

    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchPicks = async () => {
      try {
        const response = await productService.getPicks();

        if (!mounted) {
          return;
        }

        setPickProducts((response.items ?? []).slice(0, 4));
      } catch {
        if (mounted) {
          setPickProducts([]);
        }
      }
    };

    void fetchPicks();

    return () => {
      mounted = false;
    };
  }, []);

  const activeCategoryData =
    categories.find((category) => category.name === hoveredCategory) ?? null;
  const activeHeroSlide = slides[activeSlideIndex] ?? slides[0];

  return (
    <section className="w-full px-3 space-y-0 mx-aut sm:px-4 lg:px-0">
      <CategoryMenu />

      {/* {activeCategoryData && (
        <div
          className="fixed left-35 top-38 z-[80] w-[min(1000px,57vw)] rounded-xl border border-blue-100 bg-white/95 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-md"
          onMouseEnter={() => setHoveredCategory(activeCategoryData.name)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dfeeff] to-[#eef6ff] text-lg shadow-sm">
                {activeCategoryData.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Category
                </p>
                <h3 className="text-lg font-bold text-slate-800">
                  {activeCategoryData.name}
                </h3>
              </div>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
              Popular picks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {activeCategoryData.children.map((child) => (
              <button
                key={child}
                type="button"
                className="flex items-center justify-between px-3 py-3 text-sm font-medium text-left transition border group rounded-2xl border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span>{child}</span>
                <span className="text-base transition text-slate-400 group-hover:text-blue-700">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )} */}

      {/* TOP AREA */}
      {/* TOP AREA */}
      <div
        className="
    grid
    gap-2
    py-1
    lg:h-[250px]
    lg:grid-cols-[35fr_35fr_30fr]
  "
      >
        {/* ============================= */}
        {/* MAIN HERO 45% */}
        {/* ============================= */}

        <div
          className={`relative overflow-hidden rounded-2xl bg-cover bg-center ${activeHeroSlide?.bgClass ?? "bg-gradient-to-r from-[#37b97f] to-[#5ec47c]"}`}
          style={
            activeHeroSlide?.image
              ? {
                  backgroundImage: `url(${activeHeroSlide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {/* Overlay */}
          {/* <div
            className="
                absolute
                inset-0
                bg-gradient-to-r
                from-white
                via-white/80
                via-20%
                to-transparent
              "
          /> */}
          {/* <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white
            from-0%
            via-white/90
            via-25%
            via-white/30
            via-25%
            to-transparent
          "
        /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/30 to-transparent" />
          {/* Soft white gradient for text readability */}

          <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-10">
            {" "}
            {/* Badge */}
            <div className="flex items-center gap-2">
              <div className="flex">
                <span
                  className="
                flex
                size-6
                items-center
                justify-center
                rounded-full
                bg-[#194891]
                text-[10px]
                font-bold
                text-white
              "
                >
                  V
                </span>

                <span
                  className="
              -ml-2
              flex
              size-6
              items-center
              justify-center
              rounded-full
              bg-[#1c8b45]
              text-[10px]
              font-bold
              text-white
            "
                >
                  T
                </span>

                <span
                  className="
              -ml-2
              flex
              size-6
              items-center
              justify-center
              rounded-full
              bg-[#e68a16]
              text-[10px]
              font-bold
              text-white
            "
                >
                  S
                </span>
              </div>

              <span
                className="
            text-[11px]
            font-semibold
            text-[#194891]
          "
              >
                China → Cambodia
              </span>
            </div>
            {/* Title */}
            <h1
              className="
          mt-4
          text-3xl
          font-extrabold
          leading-[1]
          tracking-tight
          text-[#194891]
          xl:text-4xl
          w-[60%]
        "
            >
              {activeHeroSlide?.title ?? "Shop Global"}
            </h1>
            <p className="max-w-sm mt-1 text-xs font-medium text-slate-600">
              {activeHeroSlide?.subtitle ??
                "Millions of products from China, delivered to your door."}
            </p>
            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                className="
            rounded-xl
            bg-[#194891]
            px-5
            py-2
            text-xs
            font-semibold
            text-white
            shadow-md
          "
              >
                Shop Now →
              </button>

              <button
                className="
            rounded-xl
            bg-white
            px-5
            py-2
            text-xs
            font-semibold
            text-[#194891]
            shadow-sm
          "
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlideIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeSlideIndex
                    ? "w-5 bg-[#194891] shadow-sm"
                    : "w-2 bg-white/80 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ============================= */}
        {/* FLASH SALE 25% */}
        {/* ============================= */}

        {/* <div className="relative overflow-hidden rounded-2xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`
          absolute
          inset-0
          transition-all
          duration-500

          ${
            index === activeSlideIndex
              ? "translate-x-0 opacity-100"
              : "translate-x-5 opacity-0"
          }

        `}
            >
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover w-full h-full "
                />
              )}
            </div>
          ))}

          

          <div
            className="
        absolute
        bottom-3
        left-1/2
        z-10
        flex
        -translate-x-1/2
        gap-1.5
      "
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlideIndex(index)}
                className={`
              h-1.5
              rounded-full
              transition-all

              ${
                index === activeSlideIndex
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/60"
              }

            `}
              />
            ))}
          </div>
        </div> */}
        {/* ============================= */}
        {/* HOT DEALS CARD */}
        {/* ============================= */}

        <div
          style={{
            backgroundImage: "url('/hotDeal.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="relative p-4 overflow-hidden bg-white bg-center bg-cover border shadow-xs rounded-2xl border-slate-100"
        >
          <div className="absolute inset-0 bg-white/20" />

          {/* Header */}

          <div className="relative z-10 flex items-start justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="relative flex items-center justify-center size-6">
                {/* glow */}
                <span className="absolute inset-0 rounded-full animate-ping bg-orange-400/30" />

                <Flame className="relative z-10 text-orange-500 size-6 fill-orange-500 " />
              </span>
              <span>
                <h2 className="text-sm font-extrabold tracking-[0.02em] text-[#1A4891]">
                  Hot Deals This Week
                </h2>
                {/* <p
                  className="
              text-[10px]
              text-slate-500
            "
                >
                  Don't miss out on limited time offers
                </p> */}
              </span>
            </h2>

            <span
              className="
        rounded-full
        bg-white
        px-2
        py-1
        text-[10px]
        font-semibold
        text-gray-600
      "
            >
              See More
            </span>
          </div>

          {/* Products */}

          <div className="relative z-10 grid grid-cols-2 gap-2 mt-3 sm:grid-cols-4">
            {pickProducts.length > 0
              ? pickProducts.map((item) => (
                  <div
                    key={item.sourceItemId ?? item.itemId ?? item.title}
                    className="min-w-0"
                  >
                    <HotDealTile product={item} />
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`hot-deals-skeleton-${index}`}
                    className="p-2 border animate-pulse opacity-40 rounded-xl border-slate-200 bg-slate-100"
                  >
                    <div className="rounded-md h-30 bg-slate-200" />
                    <div className="w-3/4 h-3 mt-2 rounded bg-slate-200" />
                    <div className="w-1/2 h-4 mt-2 rounded bg-slate-200" />
                  </div>
                ))}
          </div>
        </div>

        {/* ============================= */}
        {/* TRACK ORDER 30% */}
        {/* ============================= */}

        <div
          className="
      relative
      overflow-hidden
      rounded-2xl
      bg-gradient-to-br
      from-[#e8f5ff]
      to-[#dbeafe]
      px-4
      pt-8
    "
        >
          <div className="relative z-10 ">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="relative flex items-center justify-center text-2xl ">
                {/* glow */}
                {/* <span className="absolute inset-0 rounded-full animate-ping bg-orange-400/30" /> */}
                📦
              </span>
              <span className="flex flex-col leading-5">
                <h2 className="text-[25px] font-extrabold tracking-[0.02em] text-[#1A4891]">
                  Track Your Order
                </h2>
                <p
                  className="
              text-[11px]
              text-slate-500
            "
                >
                  Get real-time updates on your order status.
                </p>
              </span>
            </h2>

            <div className="flex items-center p-1 w-[55%] mt-4 bg-white shadow-sm rounded-xl">
              <input
                placeholder="Enter tracking number"
                className="flex-1 px-2 text-xs bg-transparent outline-none "
              />

              <button
                className="
            rounded-lg
            bg-[#194891]
            px-4
            py-1
            text-white
          "
              >
                →
              </button>
            </div>
          </div>

          {/* truck image */}

          <img
            src="/deliveryTrack.png"
            alt="delivery"
            className="absolute bottom-0 right-0 w-full opacity-100"
          />
        </div>
      </div>
    </section>
  );
}
