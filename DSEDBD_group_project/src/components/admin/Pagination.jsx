import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange, totalItems, pageSize }) => {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground font-medium">
        Showing {start} to {end} of {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-xl border border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => {
            const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
            return (
              <span key={p} className="flex items-center gap-1">
                {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`min-w-[36px] h-9 rounded-xl text-sm font-semibold transition-colors ${
                    page === p
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-secondary'
                  }`}
                >
                  {p}
                </button>
              </span>
            );
          })}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-xl border border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
