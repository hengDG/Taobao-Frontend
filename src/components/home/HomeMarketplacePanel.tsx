import { useEffect, useState } from "react";
import {
  Heart,
  History,
  Store,
} from "lucide-react";


import {
  getLocalizedText,
  useLanguage,
} from "../../contexts/LanguageContext";
import { products } from "@/data/products";

const slides = [
  {
    id: "slide-1",
    title: "NIKE Official Flagship Store",
    subtitle: "The selected type is ready",
    bgClass:
      "bg-gradient-to-r from-[#37b97f] to-[#5ec47c]",
    image: products[0]?.imageUrl,
  },
  {
    id: "slide-2",
    title: "Top Home Living Picks",
    subtitle: "Trusted quality and fast shipping",
    bgClass:
      "bg-gradient-to-r from-[#3b82d6] to-[#5d8df0]",
    image: products[1]?.imageUrl,
  },
  {
    id: "slide-3",
    title: "Beauty & Daily Essentials",
    subtitle: "Hot products updated every day",
    bgClass:
      "bg-gradient-to-r from-[#6c63ff] to-[#8c7dff]",
    image: products[2]?.imageUrl,
  },
];

export function HomeMarketplacePanel() {
  const { language } = useLanguage();

  const [activeIndex, setActiveIndex] =
    useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex(
        (prev) => (prev + 1) % slides.length,
      );
    }, 3500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative mx-auto mt-3 grid w-full max-w-[95%] gap-4 pb-6 lg:grid-cols-12">
      {/* Banner */}

      <article
        className={`relative h-[150px] overflow-hidden rounded-3xl p-4 text-white shadow-[0_14px_28px_rgba(34,74,130,0.2)] sm:min-h-[270px] sm:p-5 lg:col-span-2 lg:h-full ${activeSlide.bgClass}`}
      >
        <span className="inline-flex rounded-full bg-red-600 px-2 py-1 text-xs font-semibold">
          天猫
        </span>

        <div className="w-[72%] sm:w-[70%] lg:w-[82%]">
          <h3 className="mt-2 text-2xl leading-tight font-extrabold sm:text-3xl lg:text-4xl 2xl:text-5xl">
            {activeSlide.title}
          </h3>

          <p className="mt-1 text-sm text-white/90 sm:text-base lg:text-xl">
            {activeSlide.subtitle}
          </p>
        </div>

        {activeSlide.image && (
          <div className="pointer-events-none absolute right-2 bottom-1 sm:right-3 sm:bottom-2 lg:bottom-18">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="h-28 w-auto object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)] sm:h-36 lg:h-20"
            />
          </div>
        )}

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-4">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() =>
                setActiveIndex(index)
              }
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </article>

      {/* Products */}

      <article className="rounded-3xl border border-[#e5ecff] bg-[#f7f9ff] p-4 sm:p-5 lg:col-span-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-extrabold text-[#263247] 2xl:text-xl">
            10 billion yuan subsidy · If you buy
            something expensive, you will
          </h3>

          <a
            href="/products"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#194891] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#143a75] sm:w-auto"
          >
            Show more
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {products
            .slice(0, 5)
            .map((product, index) => (
              <div
                key={product.id}
                className={`rounded-2xl border border-[#edf2ff] bg-white p-2.5 shadow-[0_10px_24px_rgba(19,40,96,0.07)] sm:p-3 ${
                  index >= 4
                    ? "hidden 2xl:block"
                    : ""
                }`}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={getLocalizedText(
                      product.title,
                      language,
                    )}
                    className="mx-auto h-24 w-full object-contain sm:h-28 lg:h-32"
                  />
                )}

                <p className="mt-2 line-clamp-2 text-xs leading-4 font-semibold text-[#2a3044] sm:text-sm sm:leading-5">
                  {getLocalizedText(
                    product.title,
                    language,
                  )}
                </p>

                <p className="mt-1 line-clamp-1 text-xs text-[#7a849f]">
                  {getLocalizedText(
                    product.shopName,
                    language,
                  )}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="rounded-md bg-[#ff5a12] px-2 py-1 text-xs font-bold text-white sm:text-sm">
                    {product.priceText}
                  </p>

                  {product.benefit && (
                    <span className="rounded-full bg-[#fff3ea] px-2 py-0.5 text-[10px] font-semibold text-[#d85a10] sm:text-xs">
                      {getLocalizedText(
                        product.benefit,
                        language,
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </article>

      {/* Login panel */}

      <article className="relative w-full overflow-hidden rounded-3xl border border-[#d9e4ff] bg-gradient-to-b from-white to-[#edf2ff] p-4 shadow-[0_14px_32px_rgba(26,66,152,0.16)] sm:p-5 lg:col-span-3">
        <div className="pointer-events-none absolute -top-6 -right-8 size-24 rounded-full bg-[#dbe6ff]" />

        <div className="pointer-events-none absolute -bottom-8 -left-8 size-20 rounded-full bg-[#dbe6ff]" />

        <div className="relative flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-[#ffb452] text-xl shadow-sm">
            🐥
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[#1f2438] sm:text-2xl">
              Good afternoon
            </h3>

            <p className="text-sm text-[#5d6379]">
              Log in for deals and faster
              checkout
            </p>
          </div>
        </div>

        <p className="relative mt-4 text-lg font-bold text-[#22293e] sm:mt-5 sm:text-xl">
          More exciting things to do
        </p>

        <button
          type="button"
          className="relative mt-3 w-full rounded-2xl bg-[#ff620f] px-4 py-3 text-lg font-extrabold text-white transition hover:bg-[#eb5606]"
        >
          Log in now
        </button>

        <button
          type="button"
          className="relative mt-2 w-full rounded-2xl border border-[#d8e1f7] bg-white px-4 py-2 text-sm font-semibold text-[#234684] transition hover:bg-[#f6f9ff]"
        >
          Register account
        </button>

        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center text-xs text-[#55607d]">
          <div className="rounded-xl bg-white/80 px-2 py-2">
            <Heart className="mx-auto mb-1 size-4 text-[#3244b7]" />
            Favorites
          </div>

          <div className="rounded-xl bg-white/80 px-2 py-2">
            <Store className="mx-auto mb-1 size-4 text-[#3244b7]" />
            Stores
          </div>

          <div className="rounded-xl bg-white/80 px-2 py-2">
            <History className="mx-auto mb-1 size-4 text-[#3244b7]" />
            Footprint
          </div>
        </div>

        <p className="relative mt-3 text-center text-xs text-[#7681a0]">
          Purchased · Coupons · History
        </p>
      </article>
    </section>
  );
}