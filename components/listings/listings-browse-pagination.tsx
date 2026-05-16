import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ListingsPaginationProps } from "@/lib/types/listings-browse";
import { PAGE_SIZE } from "@/lib/constants";

export function ListingsBrowsePagination({
  page,
  totalCount,
  isPlaceholder,
  onPageChange,
}: ListingsPaginationProps) {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1 || isPlaceholder}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Prev
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (currentPage) => {
            const show =
              currentPage === 1 ||
              currentPage === totalPages ||
              Math.abs(currentPage - page) <= 1;
            if (!show) {
              if (currentPage === 2 || currentPage === totalPages - 1) {
                return (
                  <span
                    key={currentPage}
                    className="text-muted-foreground text-sm px-1"
                  >
                    …
                  </span>
                );
              }
              return null;
            }

            return (
              <Button
                key={currentPage}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="w-9 h-9"
                disabled={isPlaceholder}
                onClick={() => onPageChange(currentPage)}
              >
                {currentPage}
              </Button>
            );
          },
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages || isPlaceholder}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
