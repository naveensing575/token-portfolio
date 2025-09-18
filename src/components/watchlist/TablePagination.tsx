import React, { memo } from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalTokens: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const TablePagination: React.FC<TablePaginationProps> = memo(({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalTokens,
  onPrevPage,
  onNextPage,
}) => (
  <div className="flex justify-between items-center px-6 py-3 bg-[#212124] border-t border-gray-600">
    <div className="text-xs text-gray-400">
      {startIndex + 1} – {Math.min(endIndex, totalTokens)} of {totalTokens} results
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">
        {currentPage} of {totalPages} pages
      </span>
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${currentPage === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-300"
          }`}
      >
        Prev
      </button>
      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${currentPage >= totalPages
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-300"
          }`}
      >
        Next
      </button>
    </div>
  </div>
));

TablePagination.displayName = 'TablePagination';

export default TablePagination;