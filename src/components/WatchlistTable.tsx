import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  updateHoldings,
  removeToken,
  selectWatchlistTokens,
  selectLoading,
} from "../features/watchlist/watchlistSlice";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import TokenImage from "./TokenImage";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change24h: number;
  sparkline: number[];
  holdings: number;
}

interface TokenRowProps {
  token: Token;
  isEditing: boolean;
  editValue: string;
  openMenuId: string | null;
  onEditHoldings: (id: string, holdings: number) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onRemoveToken: (id: string) => void;
  onToggleMenu: (id: string) => void;
  onEditValueChange: (value: string) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({
  token,
  isEditing,
  editValue,
  openMenuId,
  onEditHoldings,
  onSaveEdit,
  onCancelEdit,
  onRemoveToken,
  onToggleMenu,
  onEditValueChange,
}) => {
  const value = token.holdings * token.price;
  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-750 text-white">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <TokenImage
            src={token.image}
            alt={token.name}
            symbol={token.symbol}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-white">{token.name}</div>
            <div className="text-gray-400 text-xs">{token.symbol.toUpperCase()}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-white font-medium">{formatPrice(token.price)}</td>
      <td className={`px-4 py-3 font-semibold ${token.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
        {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
      </td>
      <td className="px-4 py-3 w-32">
        {token.sparkline?.length > 0 ? (
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={token.sparkline.map((y: number, i: number) => ({ x: i, y }))}>
              <Line
                type="monotone"
                dataKey="y"
                stroke={token.change24h >= 0 ? "#4ade80" : "#f87171"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-400 text-xs">No data</div>
        )}
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-[#A9E851]"
              autoFocus
            />
            <button
              onClick={() => onSaveEdit(token.id)}
              className="text-[#A9E851] hover:text-[#98d147] text-xs px-1 font-medium"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="text-gray-400 hover:text-gray-300 text-xs px-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span className="text-white">{token.holdings}</span>
        )}
      </td>
      <td className="px-4 py-3 font-medium text-white">
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 relative">
        <button
          onClick={() => onToggleMenu(token.id)}
          className="p-1 text-gray-400 hover:text-white rounded transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
        {openMenuId === token.id && (
          <div className="absolute right-0 top-8 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[140px]">
            <button
              onClick={() => onEditHoldings(token.id, token.holdings)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-t-lg transition-colors"
            >
              <Edit size={14} />
              Edit Holdings
            </button>
            <button
              onClick={() => onRemoveToken(token.id)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg transition-colors"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalTokens: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}> = ({
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
  );

const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tokens = useSelector(selectWatchlistTokens);
  const loading = useSelector(selectLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
        setEditingId(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTokens = tokens.slice(startIndex, endIndex);

  const handleEditHoldings = (id: string, currentHoldings: number) => {
    setEditingId(id);
    setEditValue(currentHoldings.toString());
    setOpenMenuId(null);
  };

  const handleSaveEdit = (id: string) => {
    const num = parseFloat(editValue) || 0;
    dispatch(updateHoldings({ id, holdings: num }));
    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleRemoveToken = (id: string) => {
    dispatch(removeToken(id));
    setOpenMenuId(null);
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-gray-800 shadow rounded-lg">
        <div className="p-12 text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-[#A9E851] rounded-full mx-auto mb-4"></div>
          Loading tokens...
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="mt-8 bg-gray-800 shadow rounded-lg">
        <div className="p-12 text-center text-gray-400">
          <div className="text-4xl mb-4">📈</div>
          <div className="text-lg font-medium text-gray-300 mb-2">No tokens in watchlist</div>
          <div className="text-sm">Click "Add Token" to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="mt-8 bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">24h %</th>
              <th className="px-4 py-3 font-medium">Sparkline (7d)</th>
              <th className="px-4 py-3 font-medium">Holdings</th>
              <th className="px-4 py-3 font-medium">Value</th>
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
                onEditValueChange={setEditValue}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalTokens={tokens.length}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default WatchlistTable;