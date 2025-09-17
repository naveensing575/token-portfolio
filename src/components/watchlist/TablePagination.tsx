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
  <div className="flex justify-between items-center px-4 py-3 bg-gray-700 border-t border-gray-600">
    <div className="text-sm text-gray-300">
      {startIndex + 1} – {Math.min(endIndex, totalTokens)} of {totalTokens} results
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-300">
        {currentPage} of {totalPages} pages
      </span>
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded text-sm transition-colors ${currentPage === 1
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-gray-600 text-white hover:bg-gray-500"
          }`}
      >
        Prev
      </button>
      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className={`px-3 py-1 rounded text-sm transition-colors ${currentPage >= totalPages
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-[#A9E851] text-black hover:bg-[#98d147] font-medium"
          }`}
      >
        Next
      </button>
    </div>
  </div>
));

TablePagination.displayName = 'TablePagination';

export default TablePagination;