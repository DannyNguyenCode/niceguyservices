import { SpmIcon } from "./SaturdayPetMarketShared";

export type SpmPaginationItem = number | "ellipsis";

/** Compact page list: 1 … 4 5 6 … 12 */
export function buildSpmPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): SpmPaginationItem[] {
  if (totalPages <= 1) return [];

  const totalPageNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: SpmPaginationItem[] = [1];
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  if (start > 2) pages.push("ellipsis");

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);
  return pages;
}

type SaturdayPetMarketShopPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Search results use bordered inactive page buttons. */
  variant?: "shop" | "search";
  className?: string;
};

export function SaturdayPetMarketShopPagination({
  page,
  totalPages,
  onPageChange,
  variant = "shop",
  className = "",
}: SaturdayPetMarketShopPaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildSpmPaginationItems(page, totalPages);
  const outlined = variant === "search";

  const arrowClass = outlined
    ? "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--spm-outline-variant)] text-[var(--spm-outline)] transition-all hover:border-[var(--spm-primary)] hover:text-[var(--spm-primary)] disabled:pointer-events-none disabled:opacity-40"
    : "flex h-10 w-10 items-center justify-center rounded-full border border-[var(--spm-outline-variant)] text-[var(--spm-on-surface-variant)] hover:bg-[var(--spm-surface-container-high)] disabled:pointer-events-none disabled:opacity-40";

  const pageClass = (isActive: boolean) => {
    if (isActive) {
      return "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-primary)] font-bold text-[var(--spm-on-primary)]";
    }
    if (outlined) {
      return "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--spm-outline-variant)] font-bold text-[var(--spm-on-surface-variant)] transition-all hover:border-[var(--spm-primary)] hover:text-[var(--spm-primary)]";
    }
    return "flex h-10 w-10 items-center justify-center rounded-full font-bold text-[var(--spm-on-surface-variant)] hover:bg-[var(--spm-surface-container-high)]";
  };

  return (
    <nav
      className={`mt-16 flex items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={arrowClass}
        aria-label="Previous page"
      >
        <SpmIcon name="chevron_left" />
      </button>

      <div className="flex items-center gap-1">
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-[var(--spm-on-surface-variant)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={pageClass(item === page)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={arrowClass}
        aria-label="Next page"
      >
        <SpmIcon name="chevron_right" />
      </button>
    </nav>
  );
}
