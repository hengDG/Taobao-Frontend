import { Star, Eye, ShoppingBag, ChevronRight } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import image1 from "/slideImage/slide1.jpg";
import image2 from "/slideImage/slide2.jpg";
import image3 from "/slideImage/slide3.jpg";
import image4 from "/slideImage/slide4.jpg";
import image5 from "/slideImage/tg_image_2582722055.png";
import { products } from "@/data/products";
import CategoryMenu from "@/components/home/CategoryMenu";

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

  const activeCategoryData =
    categories.find((category) => category.name === hoveredCategory) ?? null;

  return (
    <section className="w-full px-3 space-y-2 mx-aut sm:px-4 lg:px-0">
      <CategoryMenu />

      {activeCategoryData && (
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
      )}

      {/* TOP AREA */}
      {/* TOP AREA */}
      <div
        className="
    grid
    gap-2
    py-3

    lg:h-[280px]
    lg:grid-cols-[35fr_20fr_45fr]
    lg:items-stretch
  "
      >
        {/* ============================= */}
        {/* 35% - HERO */}
        {/* ============================= */}
        <div
          className="
      relative
      h-full
      min-h-[250px]
      overflow-hidden
      rounded-2xl
      px-6

      lg:min-h-0
    "
        >
          <div className="relative z-10 flex flex-col h-full max-w-4xl">
            {/* Small top information */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#dd8a16] text-[8px] font-bold text-white">
                  V
                </span>

                <span className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#177e1f] text-[8px] font-bold text-[#fbfbfb]">
                  T
                </span>

                <span className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#1A4891] text-[8px] font-bold text-white">
                  S
                </span>
              </div>

              <p className="text-[10px] font-medium tracking-wide text-[#194891] sm:text-xs">
                40,000+ customers are already buying from China
              </p>
            </div>

            {/* Main heading */}
            <div className="mt-5">
              <h1
                className="
            max-w-[900px]
            font-serif
            text-[42px]
            font-bold
            leading-[0.9]
            tracking-[0.01em]
            text-[#194891]

            xl:text-[52px]
            2xl:text-[70px]
          "
              >
                Built{" "}
                <span className="font-serif italic font-normal">For Speed</span>
                <br />
                Not Patience
              </h1>
            </div>

            {/* Description */}
            <div className="max-w-xl mt-4 italic">
              <p className="text-[11px] font-medium leading-relaxed text-black/80 sm:text-sm">
                Skip slow orders, confusing steps, and long waiting times. Your
                products are only a few simple steps away.
              </p>
            </div>
          </div>

          <div className="absolute rounded-full pointer-events-none -bottom-24 -right-20 h-72 w-72 bg-white/10 blur-3xl" />
        </div>

        {/* ============================= */}
        {/* 20% - AIRPLANE */}
        {/* ============================= */}
        {/* 25% - FLOATING PNG */}
        <div
          className="
    relative
    flex
    h-full
    min-h-[250px]
    items-center
    justify-center
    overflow-hidden
    rounded-2xl

    lg:min-h-0
  "
        >
          {/* Shadow */}
          <div
            className="
      absolute
      bottom-[12%]
      left-1/2
      h-5
      w-[48%]
      -translate-x-1/2
      rounded-[50%]
      blur-xl
      animate-floating-shadow
    "
          />

          {/* Floating image */}
          <img
            src="/airplane-3d.png"
            alt="airplane"
            className="
      relative
      z-10
      h-[100%]
      w-[100%]
      max-w-none
      right-2
      object-contain
      animate-floating-image
    "
          />
        </div>

        {/* ============================= */}
        {/* 40% - SLIDER */}
        {/* ============================= */}
        
        <div
          className="
      relative
      h-full
      min-h-[350px]
      overflow-hidden
      rounded-2xl

      lg:min-h-[320px]
    "
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`
          absolute
          inset-0
          aspect-[16/9]
          transition-all
          duration-500
          ${
            index === activeSlideIndex
              ? "translate-x-0 opacity-100"
              : "translate-x-6 opacity-0"
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

          {/* Slider Dots */}
          <div className="absolute flex gap-2 -translate-x-1/2 bottom-3 left-1/2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlideIndex(index)}
                className={`
            h-1.5
            cursor-pointer
            rounded-full
            transition-all

            ${index === activeSlideIndex ? "w-7 bg-white" : "w-1.5 bg-white/60"}
          `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
