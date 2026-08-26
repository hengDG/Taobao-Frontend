import {
  Heart,
  Star,
  Eye,
  ShoppingBag,
  Package,
  Truck,
  Clock,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Fragment } from "react";
export function HomeMarketplaceDashboard() {
  return (
    <section className="mx-auto w-full mt-15 space-y-2  px-4">
      {/* TOP AREA */}
      <div className="grid gap-2 lg:grid-cols-12">
        {/* USER CARD */}
        <div
          className="
    rounded-2xl
    border
    border-[#f2e6df]
    bg-[#fff7f2]
    p-4
    shadow-sm
    lg:col-span-3
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

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className="
          text-sm
          font-bold
          text-[#222]
        "
                >
                  tb155730102167
                </h3>

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

              <div
                className="
        mt-1
        flex
        gap-4
        text-[11px]
        text-gray-400
      "
              >
                <span>
                  Followed
                  <br />
                  Stores
                </span>

                <span>
                  Shipping
                  <br />
                  Address
                </span>
              </div>
            </div>
          </div>

          {/* ORDER STATUS */}

          <div
            className="
      mt-5
      grid
      grid-cols-5
      gap-2
      text-center
    "
          >
            {[
              {
                number: "21",
                label: "Cart",
                // icon: "🛒",
              },
              {
                number: "2",
                label: "To Pay",
                // icon: "💳",
              },
              {
                number: "0",
                label: "To Ship",
                // icon: "📦",
              },
              {
                number: "0",
                label: "Receive",
                // icon: "🚚",
              },
              {
                number: "0",
                label: "Review",
                // icon: "⭐",
              },
            ].map((item) => (
              <div key={item.label}>
                <div
                  className="
          text-lg
        "
                >
                  {item.icon}
                </div>

                <p
                  className="
          mt-1
          text-sm
          font-bold
          text-gray-800
        "
                >
                  {item.number}
                </p>

                <span
                  className="
          text-[10px]
          text-gray-400
        "
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* WALLET */}

          <div
            className="
      mt-5
      rounded-xl
      bg-white
      p-3
    "
          >
            <div
              className="
        grid
        grid-cols-3
        text-center
      "
            >
              {[
                ["$125.00", "Red Packet"],
                ["11", "Coupons"],
                ["$0.00", "Coins"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p
                    className="
            text-sm
            font-bold
            text-gray-800
          "
                  >
                    {value}
                  </p>

                  <span
                    className="
            text-[11px]
            text-gray-400
          "
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EXPIRING ALERT */}

          {/* <div
            className="
      mt-4
      flex
      items-center
      justify-between
      rounded-xl
      bg-white
      p-3
      text-xs
    "
          >
            <div className="flex items-center gap-2">
              <span
                className="
        text-red-500
      "
              >
                🎁
              </span>

              <span>
                <b className="text-red-500">$0.43</b> packet expires in 5h
              </span>
            </div>

            <ChevronRight size={15} className="text-gray-400" />
          </div> */}

          {/* PRICE ALERT */}

          {/* <div
            className="
      mt-3
      flex
      gap-3
      rounded-xl
      bg-white
      p-3
    "
          >
            <div
              className="
        h-10
        w-10
        rounded-lg
        bg-gray-100
      "
            />

            <div>
              <p
                className="
        text-xs
        font-semibold
      "
              >
                Price Drop Alert
              </p>

              <p
                className="
        text-[11px]
        text-gray-400
      "
              >
                Some items you liked are now on sale!
              </p>
            </div>
          </div> */}

          {/* QUICK MENU */}

          <div
            className="
      mt-5
      grid
      grid-cols-4
      gap-2
      text-center
    "
          >
            {[
              {
                icon: <ShoppingBag size={16} />,
                label: "Orders",
              },
              {
                icon: <Star size={16} />,
                label: "Favorites",
              },
              {
                icon: <Eye size={16} />,
                label: "Viewed",
              },
              {
                icon: <Package size={16} />,
                label: "Footprint",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="
          rounded-xl
          bg-white
          py-2
          text-gray-500
        "
              >
                <div
                  className="
          flex
          justify-center
        "
                >
                  {item.icon}
                </div>

                <p
                  className="
          mt-1
          text-[10px]
        "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TRACK ORDER */}

        <div
          className="
    rounded-2xl
    border
    border-gray-100
    bg-white
    p-5
    shadow-sm
    lg:col-span-3
  "
        >
          {/* HEADER */}

          <div
            className="
      mb-5
      flex
      items-center
      justify-between
    "
          >
            <h3 className="text-base font-bold text-[#222]">
              Track Your Orders
            </h3>

            <button
              className="
        text-xs
        text-gray-400
        hover:text-[#ff5000]
      "
            >
              View All
            </button>
          </div>

          <div className="space-y-5">
            {[
              {
                image: "https://picsum.photos/100",
                step: 1,
              },
              {
                image: "https://picsum.photos/101",
                step: 2,
              },
              {
                image: "https://picsum.photos/102",
                step: 4,
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
                {/* IMAGE */}

                <img
                  src={order.image}
                  alt="order"
                  className="
            h-12
            w-12
            shrink-0
            rounded-xl
            object-cover
          "
                />

                {/* RIGHT SIDE */}

                <div className="flex-1">
                  {/* TRACK LINE */}

                  <div
                    className="
              flex
              items-center
              w-full
            "
                  >
                    {[1, 2, 3, 4].map((stepNumber, i) => (
                      <Fragment key={stepNumber}>
                        {/* DOT */}

                        <div
                          className={`
                    h-2
                    w-2
                    rounded-full
                    shrink-0

                    ${stepNumber <= order.step ? "bg-[#ff5000]" : "bg-gray-300"}
                  `}
                        />

                        {/* LINE */}

                        {i < 3 && (
                          <div
                            className={`
                      h-[2px]
                      flex-1

                      ${
                        stepNumber < order.step ? "bg-[#ff5000]" : "bg-gray-200"
                      }
                    `}
                          />
                        )}
                      </Fragment>
                    ))}
                  </div>

                  {/* LABELS */}

                  <div
                    className="
              mt-2
              flex
              justify-between
              text-[10px]
              text-gray-400
            "
                  >
                    <span className={order.step >= 1 ? "text-[#ff5000]" : ""}>
                      Paid
                    </span>

                    <span className={order.step >= 2 ? "text-[#ff5000]" : ""}>
                      Store
                    </span>

                    <span className={order.step >= 3 ? "text-[#ff5000]" : ""}>
                      Ship
                    </span>

                    <span className={order.step >= 4 ? "text-[#ff5000]" : ""}>
                      Done
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP STORES */}
        <div
          className="
          rounded-2xl
          bg-white
          p-5
          shadow-sm
          lg:col-span-3
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
            grid-cols-4
            gap-4
          "
          >
            {[
              "Xiaomi",
              "Apple",
              "Nike",
              "Uniqlo",
              "Adidas",
              "Huawei",
              "Lenovo",
              "OPPO",
            ].map((store) => (
              <div
                key={store}
                className="
                  text-center
                "
              >
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

                <span
                  className="
                  text-[10px]
                  text-gray-400
                "
                >
                  Official Store
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AD */}
        <div
          className="
          relative
          overflow-hidden
          rounded-2xl
          bg-gradient-to-b
          from-orange-400
          to-orange-600
          p-5
          text-white
          lg:col-span-3
        "
        >
          <span
            className="
            rounded
            bg-white
            px-2
            py-1
            text-xs
            text-orange-500
          "
          >
            Cainiao Express
          </span>

          <h2
            className="
            mt-5
            text-3xl
            font-black
          "
          >
            Play with
            <br />
            New Tech
          </h2>

          <p
            className="
            mt-3
            text-sm
          "
          >
            Get 15% off with subsidy coupon
          </p>

          <button
            className="
            mt-5
            rounded-full
            bg-white
            px-5
            py-2
            text-orange-500
            font-bold
          "
          >
            Shop Now
          </button>

          <img
            src="/ad-image.png"
            className="
              absolute
              bottom-4
              right-4
              h-24
              rounded-xl
            "
          />
        </div>
      </div>

      {/* MARKETPLACE CATEGORY */}

      <div
        className="
    flex
    gap-2
    overflow-x-auto
    py-0
    scrollbar-none
  "
      >
        {[
          {
            name: "Tmall",
            icon: "🟥",
          },
          {
            name: "Taobao Live",
            icon: "📺",
          },
          {
            name: "Enterprise Purchase",
            icon: "🟧",
          },
          {
            name: "Judicial Auction",
            icon: "🔨",
          },
          {
            name: "Tmall Supermarket",
            icon: "🟩",
          },
          {
            name: "Government Subsidy",
            icon: "🎁",
          },
          {
            name: "Coupon Center",
            icon: "🎟️",
          },
        ].map((item) => (
          <button
            key={item.name}
            className="
        group
        flex
        h-11
        shrink-0
        items-center
        gap-2
        rounded-xl
        border
        border-gray-100
        bg-white
        px-4
        text-xs
        font-semibold
        text-gray-700

        shadow-[0_2px_8px_rgba(0,0,0,0.05)]

        transition-all
        duration-200

        hover:shadow-[0_5px_12px_rgba(0,0,0,0.08)]
      "
          >
            <span
              className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-lg
          bg-gray-50
          text-sm
        "
            >
              {item.icon}
            </span>

            <span className="whitespace-nowrap">{item.name}</span>
          </button>
        ))}
      </div>

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
        >
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
