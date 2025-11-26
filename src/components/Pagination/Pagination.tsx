import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 12,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const pages = useMemo(() => {
    // Up to 7 buttons around current page
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, safePage - 3);
    return Array.from({ length: 7 }, (_, i) => Math.min(totalPages, start + i));
  }, [safePage, totalPages]);

  const showingStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingEnd = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {/* Prev */}
        <button
          aria-label="Previous page"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          className="w-10 h-10 rounded-xl border border-[#e5e7eb] bg-white shadow-sm text-[#1e4e79] disabled:opacity-40 grid place-items-center"
        >
          ‹
        </button>

        {/* Page numbers */}
        {pages.map((pageNumber) => {
          const isActive = pageNumber === safePage;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-xl border border-[#e5e7eb] shadow-sm grid place-items-center ${
                isActive ? "bg-[#f7c948] text-white" : "bg-white text-[#1e4e79]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next */}
        <button
          aria-label="Next page"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="w-10 h-10 rounded-xl border border-[#e5e7eb] bg-white shadow-sm text-[#1e4e79] disabled:opacity-40 grid place-items-center"
        >
          ›
        </button>
      </div>

      {/* Summary */}
      <p className="font-outfit text-[#6b7280] text-sm">
        Showing {showingStart}-{showingEnd} of {totalItems} opportunities
      </p>
    </div>
  );
}
