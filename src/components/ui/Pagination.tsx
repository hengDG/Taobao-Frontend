type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
};

const range = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i += 1) result.push(i);
  return result;
};

function getPageList(
  total: number,
  current: number,
  siblingCount = 1,
  boundaryCount = 1,
) {
  const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;

  if (total <= totalNumbers) {
    return range(1, total);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftDots = leftSibling > boundaryCount + 2;
  const showRightDots = rightSibling < total - (boundaryCount + 1);

  const leftRange = range(1, boundaryCount);
  const rightRange = range(total - boundaryCount + 1, total);

  const middleRange = range(leftSibling, rightSibling);

  const pages: (number | "...")[] = [];

  pages.push(...leftRange);

  if (showLeftDots) pages.push("...");

  pages.push(...middleRange);

  if (showRightDots) pages.push("...");

  pages.push(...rightRange);

  // dedupe and filter out invalid numbers
  const deduped = pages.filter(
    (v, i) => !(typeof v === "number" && pages.indexOf(v) !== i),
  ) as (number | "...")[];

  return deduped;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageList(
    totalPages,
    currentPage,
    siblingCount,
    boundaryCount,
  );

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
      >
        ‹
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-sm text-slate-500">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`min-w-[38px] rounded-lg border px-3 py-2 text-sm font-medium ${
              p === currentPage
                ? "bg-[#194891] text-white"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
      >
        ›
      </button>
    </nav>
  );
}
