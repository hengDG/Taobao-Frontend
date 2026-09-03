import { Star, Eye, ShoppingBag } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { products } from "@/data/products";

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
    image: products[0]?.imageUrl,
  },
  {
    id: "slide-2",
    title: "Top Home Living Picks",
    subtitle: "Trusted quality and fast shipping",
    bgClass: "bg-gradient-to-r from-[#3b82d6] to-[#5d8df0]",
    image: products[1]?.imageUrl,
  },
  {
    id: "slide-3",
    title: "Beauty & Daily ",
    subtitle: "Hot products updated every day",
    bgClass: "bg-gradient-to-r from-[#6c63ff] to-[#8c7dff]",
    image: products[6]?.imageUrl,
  },
];

export function HomeMarketplaceDashboard() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeOrder, setActiveOrder] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

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

  const activeSlide = slides[activeSlideIndex] ?? slides[0];

  return (
    <section className="mx-auto w-full mt-5 space-y-2  px-0">
      {/* TOP AREA */}
      <div className="grid gap-2 lg:grid-cols-10">
        {" "}
        {/* USER + TRACK COMBINED CARD */}
        <div
          className="
    lg:col-span-5
    rounded-2xl
    border
    border-gray-100
    bg-white
    p-4
    shadow-sm
  "
        >
          <div
            className="
      grid
      grid-cols-[42%_58%]
      gap-4
    "
          >
            {/* USER SECTION */}
            <div
              className="
        border-r
        border-gray-100
        pr-4
      "
            >
              {/* USER INFO */}
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="avatar"
                  className="
            h-12
            w-12
            rounded-full
            border-2
            border-white
            object-cover
            shadow-sm
          "
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#222]">VTS-55734</h3>

                    <span
                      className="
                rounded-full
                bg-[#ff5000]
                px-1.5
                py-0.5
                text-[9px]
                font-bold
                text-white
              "
                    >
                      VIP
                    </span>
                  </div>

                  <div className="mt-1 flex gap-3 text-[11px] text-gray-400">
                    <span>Premium User</span>
                    {/* <span>Shipping</span> */}
                  </div>
                </div>
              </div>

              {/* ORDER STATUS */}
              <div
                className="
          mt-3
          grid
          grid-cols-3
          gap-2
          text-center
        "
              >
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

                    <span className="text-[10px] text-gray-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* QUICK MENU */}
              <div
                className="
          mt-2
          grid
          grid-cols-3
          gap-2
        "
              >
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
                    className="
              rounded-xl
              bg-gray-50
              py-2
              text-center
              text-gray-500
            "
                  >
                    <div className="flex justify-center">{item.icon}</div>

                    <p className="mt-1 text-[10px]">{item.label}</p>
                  </div>
                ))}
              </div>
              
              {/* ACTIVE ORDER SLIDER */}

              <div className="mt-3">
                {/* Slider Container */}

                <div
                  className="
      overflow-hidden
      rounded-xl
    "
                >
                  <div
                    className={`
 flex
 ${enableTransition ? "transition-transform duration-500 ease-out" : ""}
`}
                    style={{
                      transform: `translateX(-${activeOrder * 100}%)`,
                    }}
                  >
                    {userOrders.map((order, index) => (
                      <div
                        key={index}
                        className="
            flex
            min-w-full
            items-center
            gap-3
            rounded-xl
            bg-gray-50
            p-2.5
            transition
            hover:bg-gray-100
          "
                      >
                        {/* Product Image */}

                        <img
                          src={order.image}
                          alt=""
                          className="
              h-8
              w-8
              shrink-0
              rounded-xl
              object-cover
            "
                        />

                        {/* Order Information */}

                        <div
                          className="
              flex-1
              overflow-hidden
            "
                        >
                          <div
                            className="
                flex
                items-center
                justify-between
              "
                          >
                            <span
                              className="
                  text-[11px]
                  font-bold
                  text-[#ff5000]
                "
                            >
                              {order.status}
                            </span>

                            <span
                              className="
                  text-[11px]
                  text-gray-400
                "
                            >
                              {order.date}
                            </span>
                          </div>

                          <p
                            className="
                mt-1
                truncate
                text-[10px]
                text-gray-600
              "
                          >
                            {order.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slider dots */}

                {/* <div
                  className="
      mt-2
      flex
      justify-center
      gap-1
    "
                >
                  {userOrders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveOrder(index)}
                      className={[
                        "h-1.5 rounded-full transition-all duration-300",
                        activeOrder === index
                          ? "w-4 bg-[#ff5000]"
                          : "w-1.5 bg-gray-300",
                      ].join(" ")}
                    />
                  ))}
                </div> */}
              </div>
            </div>

            {/* TRACK SECTION */}
            <div
              className="w-full 
           pr-5"
            >
              <div
                className="
          mb-5
          flex
          items-center
          justify-between
        "
              >
                <h3 className="text-sm font-bold">Track Your Orders</h3>

                <button className="text-xs text-gray-400">View All</button>
              </div>

              <div className="space-y-5">
                {[
                  {
                    image: products[0]?.imageUrl,
                    step: 1,
                  },
                  {
                    image: products[1]?.imageUrl,
                    step: 2,
                  },
                  {
                    image: products[6]?.imageUrl,
                    step: 5,
                  },
                ].map((order, index) => (
                  <div
                    key={index}
                    className="
              flex
              items-center
              gap-3
            "
                  >
                    <img
                      src={order.image}
                      className="
                h-12
                w-12
                rounded-xl
                object-cover
              "
                    />
                    {/* update tracking  to paid store china shipping cambodia delivered */}

                    <div className="flex-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5, 6].map((step, i) => (
                          <Fragment key={step}>
                            <div
                              className={`
                        h-2
                        w-2
                        rounded-full
                        ${step <= order.step ? "bg-[#ff5000]" : "bg-gray-300"}
                      `}
                            />

                            {i < 5 && (
                              <div
                                className={`
                          h-[2px]
                          flex-1
                          ${step < order.step ? "bg-[#ff5000]" : "bg-gray-200"}
                        `}
                              />
                            )}
                          </Fragment>
                        ))}
                      </div>

                      <div
                        className="
                  mt-2
                  flex
                  justify-between
                  gap-1
                  text-[10px]
                  text-gray-400
                "
                      >
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
        {/* TOP STORE + SMALL CARDS */}
        <div
          className="
    lg:col-span-3
    space-y-2
  "
        >
          {/* TOP STORE */}
          <div
            className="
      rounded-2xl
      bg-white
      p-5
      shadow-sm
    "
          >
            <div
              className="
        flex
        justify-between
      "
            >
              <h3 className="font-bold">Top Stores</h3>

              <span className="text-xs text-gray-400">View All</span>
            </div>

            <div
              className="
        mt-5
        grid
        grid-cols-5
        gap-2
      "
            >
              {["Xiaomi", "Apple", "Nike", "Uniqlo", "Adidas"].map((store) => (
                <div key={store} className="text-center">
                  <div
                    className="
              mx-auto
              h-10
              w-10
              rounded-xl
              bg-gray-100
            "
                  />

                  <p
                    className="
              mt-2
              text-xs
              font-semibold
            "
                  >
                    {store}
                  </p>

                  {/* <span
                    className="
              text-[10px]
              text-gray-400
            "
                  >
                    Official Store
                  </span> */}
                </div>
              ))}
            </div>
          </div>

          {/* SMALL CARDS */}
          <div
            className="
      grid
      grid-cols-2
      gap-2
    "
          >
            {/* COUPON */}
            <div
              className="
        rounded-2xl
        bg-gradient-to-br
        from-orange-50
        to-orange-100
        p-4
        shadow-sm
      "
            >
              <div className="text-xl">🎟️</div>

              <h4
                className="
          mt-2
          text-sm
          font-bold
          text-gray-800
        "
              >
                Coupon
              </h4>

              <p
                className="
          mt-1
          text-[11px]
          text-gray-500
        "
              >
                Get discount coupons
              </p>
            </div>

            {/* LIVE */}
            <div
              className="
        rounded-2xl
        bg-gradient-to-br
        from-red-50
        to-pink-100
        p-4
        shadow-sm
      "
            >
              <div className="text-xl">📺</div>

              <h4
                className="
          mt-2
          text-sm
          font-bold
          text-gray-800
        "
              >
                Live
              </h4>

              <p
                className="
          mt-1
          text-[11px]
          text-gray-500
        "
              >
                Watch shopping live
              </p>
            </div>
          </div>
        </div>
        {/* AD */}
        <div className="relative lg:col-span-2">
          <div
            className={`relative h-full min-h-[200px] overflow-hidden rounded-2xl p-5 text-white shadow-[0_14px_30px_rgba(34,74,130,0.15)] ${activeSlide.bgClass}`}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col justify-between p-5 transition-all duration-500 ${
                  index === activeSlideIndex
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0"
                }`}
              >
                <div>
                  {/* <span className="inline-flex rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-white/90">
                    Featured
                  </span> */}

                  <h2 className=" text-2xl font-black leading-tight sm:text-3xl">
                    {slide.title}
                  </h2>

                  <p className="mt-2 max-w-[80%] text-sm text-white/90">
                    {slide.subtitle}
                  </p>
                </div>

                {slide.image && (
                  <div className="flex justify-end">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-24 w-auto rounded-2xl border border-white/30 bg-white/10 object-cover shadow-lg backdrop-blur-sm sm:h-28"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlideIndex
                      ? "w-7 bg-white"
                      : "w-2.5 bg-white/60"
                  }`}
                  aria-label={`View slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MARKETPLACE CATEGORY */}
      {/* <div className="relative mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = openCategoryId === item.id;

          return (
            <div
              key={item.id}
              className="relative shrink-0"
              onMouseEnter={() => hasChildren && setOpenCategoryId(item.id)}
              onMouseLeave={() => hasChildren && setOpenCategoryId(null)}
            >
              <button
                type="button"
                className="group flex h-9 items-center gap-2 rounded-xl border border-gray-100 bg-white px-2 text-xs font-semibold text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-[0_5px_12px_rgba(0,0,0,0.08)]"
                onClick={() =>
                  hasChildren &&
                  setOpenCategoryId((prev) =>
                    prev === item.id ? null : item.id,
                  )
                }
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-sm">
                  {item.name.charAt(0).toUpperCase()}
                </span>
                <span className="whitespace-nowrap">{item.name}</span>
                {hasChildren && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {hasChildren && isOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 min-w-[180px] rounded-xl border border-gray-100 bg-white p-2 shadow-[0_16px_30px_rgba(15,23,42,0.12)]">
                  {item.children!.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-gray-700 transition hover:bg-gray-50"
                    >
                      <span>{child.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div> */}

      {/* RECOMMENDATION TAB */}

      {/* <div
        className="
    flex
    justify-center
    gap-3
    py-0
  "
      >

        <button
          className="
      flex
      h-9
      items-center
      gap-2
      rounded-full
      bg-white
      px-5
      text-sm
      font-semibold
      text-gray-700

      shadow-[0_2px_8px_rgba(0,0,0,0.06)]

      transition
      hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]
    "
        >F
          Explore
        </button>


        <button
          className="
      relative
      flex
      h-9
      items-center
      gap-2
      rounded-full
      bg-white
      px-5
      text-sm
      font-semibold
      text-gray-700

      shadow-[0_2px_8px_rgba(0,0,0,0.06)]

      transition
      hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]
    "
        >
          Following
          <span
            className="
        absolute
        -right-1
        -top-1
        rounded-full
        bg-red-500
        px-1.5
        text-[8px]
        font-bold
        text-white
      "
          >
            New
          </span>
        </button>
      </div> */}
    </section>
  );
}
