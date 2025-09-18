import React, { useEffect, useRef } from "react";
import { useWatchlistTable } from "../../hooks/useWatchlistTable";
import TokenRow from "./TokenRow";
import TablePagination from "./TablePagination";

const LoadingState: React.FC = () => (
  <div className="mt-8 bg-gray-800 shadow rounded-lg">
    <div className="p-12 text-center text-gray-400">
      <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-[#A9E851] rounded-full mx-auto mb-4"></div>
      Loading tokens...
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="mt-8 bg-gray-800 shadow rounded-lg">
    <div className="p-12 text-center text-gray-400">
      <div className="text-4xl mb-4">📈</div>
      <div className="text-lg font-medium text-gray-300 mb-2">No tokens in watchlist</div>
      <div className="text-sm">Click "Add Token" to get started</div>
    </div>
  </div>
);

const WatchlistTable: React.FC = () => {
  const {
    loading,
    tokens,
    currentTokens,
    currentPage,
    openMenuId,
    editingId,
    editValue,
    paginationData,
    closeAllModals,
    handleEditHoldings,
    handleSaveEdit,
    handleCancelEdit,
    handleRemoveToken,
    toggleMenu,
    handlePrevPage,
    handleNextPage,
    handleEditValueChange,
  } = useWatchlistTable();

  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeAllModals();
      }
    };

    if (openMenuId || editingId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId, editingId, closeAllModals]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeAllModals]);

  // Early returns for loading and empty states
  if (loading) return <LoadingState />;
  if (tokens.length === 0) return <EmptyState />;

  return (
    <div ref={menuRef} className="mt-8 bg-[#212124] shadow rounded-lg overflow-hidden border border-gray-600">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left table-fixed">
          <thead className="bg-[#27272A] text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium w-1/5">Token</th>
              <th className="px-4 py-3 font-medium w-1/6">Price</th>
              <th className="px-4 py-3 font-medium w-1/8">24h %</th>
              <th className="px-4 py-3 font-medium w-1/6">Sparkline (7d)</th>
              <th className="px-4 py-3 font-medium w-1/8">Holdings</th>
              <th className="px-4 py-3 font-medium w-1/6">Value</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {currentTokens.map((token) => (
              <TokenRow
                key={token.id}
                token={token}
                isEditing={editingId === token.id}
                editValue={editValue}
                openMenuId={openMenuId}
                onEditHoldings={handleEditHoldings}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onRemoveToken={handleRemoveToken}
                onToggleMenu={toggleMenu}
                onEditValueChange={handleEditValueChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={paginationData.totalPages}
        startIndex={paginationData.startIndex}
        endIndex={paginationData.endIndex}
        totalTokens={tokens.length}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default WatchlistTable;