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

const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tokens = useSelector(selectWatchlistTokens);
  const loading = useSelector(selectLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(tokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTokens = tokens.slice(startIndex, endIndex);

  // Debug info
  console.log("Debug:", {
    tokensLength: tokens.length,
    totalPages,
    currentPage,
    isNextDisabled: currentPage >= totalPages
  });

  const handleHoldingsChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    dispatch(updateHoldings({ id, holdings: num }));
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
    <div className="mt-8 overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Token</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">24h %</th>
            <th className="px-4 py-2">Sparkline (7d)</th>
            <th className="px-4 py-2">Holdings</th>
            <th className="px-4 py-2">Value</th>
            <th className="px-4 py-2">Menu</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Loading...
              </td>
            </tr>
          )}
          {!loading && tokens.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No tokens in watchlist. Click "Add Token" to get started.
              </td>
            </tr>
          )}
          {!loading &&
            currentTokens.map((t) => {
              const value = t.holdings * t.price;
              return (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-gray-500 text-xs">{t.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">${t.price.toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${t.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {t.change24h >= 0 ? "+" : ""}{t.change24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 w-32">
                    {t.sparkline.length > 0 ? (
                      <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={t.sparkline.map((y, i) => ({ x: i, y }))}>
                          <Line
                            type="monotone"
                            dataKey="y"
                            stroke={t.change24h >= 0 ? "#16a34a" : "#dc2626"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-400 text-xs">No data</div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={t.holdings}
                      onChange={(e) =>
                        handleHoldingsChange(t.id, e.target.value)
                      }
                      className="w-20 border rounded px-2 py-1 text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">
                    ${value.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => dispatch(removeToken(t.id))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {tokens.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            {startIndex + 1} – {Math.min(endIndex, tokens.length)} of {tokens.length} results
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {currentPage} of {totalPages} pages
            </span>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || tokens.length === 0}
              className={`px-3 py-1 rounded text-sm ${currentPage >= totalPages || tokens.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
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