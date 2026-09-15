import { Star, Eye, ShoppingBag } from "lucide-react";
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
    <section className="mx-aut  w-full space-y-2 px-3 sm:px-4 lg:px-0">
      <CategoryMenu />

      {activeCategoryData && (
        <div
          className="fixed left-35 top-38 z-[80] w-[min(1000px,57vw)] rounded-xl border border-blue-100 bg-white/95 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-md"
          onMouseEnter={() => setHoveredCategory(activeCategoryData.name)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="mb-4 flex items-center justify-between">
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
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span>{child}</span>
                <span className="text-base text-slate-400 transition group-hover:text-blue-700">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TOP AREA */}
      <div
        className="
    flex
    flex-col
    gap-2
    lg:flex-row
    lg:items-stretch
  "
      >
        {" "}
        {/* USER + TRACK COMBINED CARD */}
        <div
          className="
            relative
            flex-1
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            border-blue-100
            bg-cover
            bg-center
            bg-no-repeat
            p-3
            shadow-sm
            sm:p-4
          "
          style={{
            backgroundImage: "url('/backgroundSlideImage.png')",
          }}
        >
          {/* Background overlay */}
          <div className="
  absolute
  inset-0
  bg-gradient-to-r
  from-white/60
  via-white/10
  to-transparent
  backdrop-blur-[2px]
" />

          {/* USER + TRACK CONTENT */}
          <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-[42%_58%] 2xl:grid-cols-[42%_58%]">
            {/* USER SECTION */}
            <div className="border-b border-white/40 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 space-y-4">
              {/* USER INFO */}
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="avatar"
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#222]">VTS-55734</h3>

                    <span className="rounded-full bg-[#F97908] px-1.5 py-0.5 text-[9px] font-bold text-white">
                      VIP
                    </span>
                  </div>

                  <div className="mt-1 flex gap-3 text-[11px] text-[#323232]">
                    <span>Premium User</span>
                    {/* <span>Shipping</span> */}
                  </div>
                </div>
              </div>

              {/* ORDER STATUS */}
              <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                {[
                  {
                    number: "21",
                    label: "Cart",
                  },
                  {
                    number: "2",
                    label: "To Pay",
                  },
                  {
                    number: "0",
                    label: "To Ship",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-bold text-gray-800">
                      {item.number}
                    </p>

                    <span className="text-[10px] text-[#133458]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* QUICK MENU */}
              <div className="mt-2 grid grid-cols-3 gap-3">
                {[
                  {
                    icon: <ShoppingBag size={15} />,
                    label: "Orders",
                  },
                  {
                    icon: <Star size={15} />,
                    label: "Favorites",
                  },
                  {
                    icon: <Eye size={15} />,
                    label: "Viewed",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-gray-50 py-2 text-center text-gray-500"
                  >
                    <div className="flex justify-center">{item.icon}</div>

                    <p className="mt-1 text-[10px]">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* ACTIVE ORDER SLIDER */}
              <div className="mt-3">
                {/* Slider Container */}
                <div className="overflow-hidden rounded-xl">
                  <div
                    className={`flex ${enableTransition ? "transition-transform duration-500 ease-out" : ""}`}
                    style={{
                      transform: `translateX(-${activeOrder * 100}%)`,
                    }}
                  >
                    {userOrders.map((order, index) => (
                      <div
                        key={index}
                        className="flex min-w-full items-center gap-3 rounded-xl bg-gray-50 p-2.5 transition hover:bg-gray-100"
                      >
                        {/* Product Image */}
                        <img
                          src={order.image}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-xl object-cover"
                        />

                        {/* Order Information */}
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#F97908]">
                              {order.status}
                            </span>

                            <span className="text-[11px] text-gray-400">
                              {order.date}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-[10px] text-gray-600">
                            {order.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TRACK SECTION */}
            <div className="w-full pt-1 sm:pr-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-bold">Track Your Orders</h3>

                <button className="text-xs text-gray-400">View All</button>
              </div>

              <div className="space-y-7">
                {[
                  {
                    image:
                      "https://img.alicdn.com/imgextra/i1/2214183122092/O1CN011VvJPQ1RKBNZ61qun_!!0-item_pic.jpg",
                    step: 1,
                  },
                  {
                    image:
                      "https://img.alicdn.com/imgextra/i1/132334451/O1CN01undF2r1ikc2VjbaER~crop,0,0,1842,1842~_!!132334451.jpg",
                    step: 2,
                  },
                  {
                    image:
                      "https://img.alicdn.com/imgextra/i2/2215507736160/O1CN01fnRgKL1vNKht37F1E_!!2215507736160.jpg",
                    step: 5,
                  },
                ].map((order, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={order.image}
                      className="h-12 w-12 rounded-xl object-cover"
                    />

                    {/* update tracking to paid store china shipping cambodia delivered */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5, 6].map((step, i) => (
                          <Fragment key={step}>
                            <div
                              className={`h-2 w-2 rounded-full ${
                                step <= order.step
                                  ? "bg-[#F97908]"
                                  : "bg-gray-500"
                              }`}
                            />

                            {i < 5 && (
                              <div
                                className={`h-[2px] flex-1 ${
                                  step < order.step
                                    ? "bg-[#F97908]"
                                    : "bg-gray-400"
                                }`}
                              />
                            )}
                          </Fragment>
                        ))}
                      </div>

                      <div className="mt-2 flex justify-between gap-1 text-[10px] text-gray-800">
                        <span>Paid</span>
                        <span>Store</span>
                        <span>China</span>
                        <span>Shipping</span>
                        <span>Cambodia</span>
                        <span>Done</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* AD */}
        <div
          className="
    w-full
    shrink-0

    lg:w-[240px]
    xl:w-[260px]
    2xl:w-[280px]
  "
        >
          <div
            className="
      relative
      aspect-square
      w-full
      overflow-hidden
      rounded-2xl
    "
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
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
                    className="
              h-full
              w-full
              rounded-2xl
              object-cover
            "
                  />
                )}
              </div>
            ))}

            {/* Slider Dots */}
            <div
              className="
        absolute
        bottom-2
        left-1/2
        flex
        -translate-x-1/2
        gap-2
      "
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  className={`
            h-1.5
            rounded-full
            transition-all

        cursor-pointer
            ${index === activeSlideIndex ? "w-7 bg-white" : "w-1.5 bg-white/60"}
          `}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Category */}
        <div
          className="
    w-full
    shrink-0
    lg:w-[300px]
    2xl:w-[500px]
  "
        >
          {" "}
          <div className="rounded-2xl bg-white/50 p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.name}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() =>
                    setHoveredCategory((current) =>
                      current === category.name ? null : current,
                    )
                  }
                  className="
            rounded-[18px]
            bg-gradient-to-b
            from-[#9EC5FF]
            via-[#D7E8FF]
            to-[#F4F9FF]
            p-[1px]
            shadow-sm
            transition
            hover:-translate-y-0.5
            hover:shadow-md
          "
                >
                  <div
                    className="
              relative
              flex
              h-[80px]
              items-start
              overflow-hidden
              rounded-[17px]
              bg-gradient-to-bl
              from-[#E8F2FF]
              via-[#F7FBFF]
              to-white
              px-3
              pt-3
            "
                  >
                    <p className="relative z-10 max-w-[110px] text-[14px] font-semibold leading-[18px] text-[#1E293B]">
                      {category.name}
                    </p>

                    <img
                      src={category.image}
                      alt={category.name}
                      className="
                absolute
                2xl:bottom-[-13px]
                2xl:right-[-6px]
                2xl:h-[80px]
                2xl:w-[80px]
                bottom-[-10px]
                right-[-5px]
                h-17
                w-17
                object-contain
              "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
