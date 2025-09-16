import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  updateHoldings,
  removeToken,
  selectWatchlistTokens,
  selectLoading,
} from "../features/watchlist/watchlistSlice";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tokens = useSelector(selectWatchlistTokens);
  const loading = useSelector(selectLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
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

  return (
    <div className="mt-8 overflow-x-auto bg-gray-800 shadow rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Token</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">24h %</th>
            <th className="px-4 py-3">Sparkline (7d)</th>
            <th className="px-4 py-3">Holdings</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-400">
                Loading...
              </td>
            </tr>
          )}
          {!loading && tokens.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-400">
                No tokens in watchlist. Click "Add Token" to get started.
              </td>
            </tr>
          )}
          {!loading &&
            currentTokens.map((t) => {
              const value = t.holdings * t.price;
              const isEditing = editingId === t.id;

              return (
                <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-750 text-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-white">{t.name}</div>
                        <div className="text-gray-400 text-xs">{t.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">${t.price.toLocaleString()}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${t.change24h >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {t.change24h >= 0 ? "+" : ""}{t.change24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 w-32">
                    {t.sparkline.length > 0 ? (
                      <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={t.sparkline.map((y, i) => ({ x: i, y }))}>
                          <Line
                            type="monotone"
                            dataKey="y"
                            stroke={t.change24h >= 0 ? "#4ade80" : "#f87171"}
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
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(t.id)}
                          className="text-green-400 hover:text-green-300 text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-white">{t.holdings}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    ${value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => toggleMenu(t.id)}
                      className="p-1 text-gray-400 hover:text-white rounded"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {openMenuId === t.id && (
                      <div className="absolute right-0 top-8 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[140px]">
                        <button
                          onClick={() => handleEditHoldings(t.id, t.holdings)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-t-lg"
                        >
                          <Edit size={14} />
                          Edit Holdings
                        </button>
                        <button
                          onClick={() => handleRemoveToken(t.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {tokens.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 bg-gray-700 border-t border-gray-600">
          <div className="text-sm text-gray-300">
            {startIndex + 1} – {Math.min(endIndex, tokens.length)} of {tokens.length} results
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">
              {currentPage} of {totalPages} pages
            </span>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${currentPage === 1
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || tokens.length === 0}
              className={`px-3 py-1 rounded text-sm ${currentPage >= totalPages || tokens.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistTable;