import type { TaobaoHomeRow } from "@/types/taobao.types";

const money = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  minimumFractionDigits: 2,
});

const formatCents = (cents: number | null | undefined) => {
  if (cents == null) return null;
  return money.format(cents / 100);
};

export function HomepageSections({
  sections,
  error,
}: {
  sections: TaobaoHomeRow[];
  error: string | null;
}) {
  return (
    <section className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b3d]">
            Home Feed
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Homepage collections
          </h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
          {sections.length} sections
        </span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
          {error}
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          No homepage data to display.
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={
                section.themeId ?? section.label ?? section.order ?? "section"
              }
              className="space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-900">
                  {section.label ?? "Collection"}
                </h3>
                <span className="text-sm text-slate-500">
                  {section.items?.length ?? 0} items
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {(section.items ?? []).map((item) => {
                  const salePrice = formatCents(
                    item.couponCents ?? item.listCents,
                  );
                  const listPrice = formatCents(item.listCents);
                  const image = item.image ?? "/placeholder-product.png";
                  const title = item.title ?? "Unnamed product";

                  return (
                    <article
                      key={item.sourceItemId ?? `${title}-${image}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (item.sourceItemId) {
                          window.open(
                            `/product/${item.sourceItemId}`,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          (event.key === "Enter" || event.key === " ") &&
                          item.sourceItemId
                        ) {
                          event.preventDefault();
                          window.open(
                            `/product/${item.sourceItemId}`,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                      }}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                          {item.categoryName ?? "Product"}
                        </div>
                      </div>

                      <div className="space-y-2 p-4">
                        <p className="line-clamp-2 min-h-[44px] text-sm font-medium leading-5 text-slate-700">
                          {title}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-600">
                            {item.soldLabel ?? "Hot"}
                          </span>
                          <span>sold</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {salePrice ? (
                            <>
                              <span className="text-lg font-bold text-[#d61f00]">
                                {salePrice}
                              </span>
                              {listPrice ? (
                                <span className="text-xs text-slate-400 line-through">
                                  {listPrice}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            <span className="text-lg font-bold text-[#d61f00]">
                              {listPrice ?? "¥0.00"}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
