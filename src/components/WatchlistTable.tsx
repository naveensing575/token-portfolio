import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  updateHoldings,
  removeToken,
  setPage,
  fetchMarketTokens,
} from "../features/watchlist/watchlistSlice";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens, loading, error, page, perPage } = useSelector(
    (state: RootState) => state.watchlist
  );

  // Fetch tokens on page change
  useEffect(() => {
    dispatch(fetchMarketTokens(page));
  }, [dispatch, page]);

  const handleHoldingsChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    dispatch(updateHoldings({ id, holdings: num }));
  };

  const handlePrev = () => {
    if (page > 1) dispatch(setPage(page - 1));
  };

  const handleNext = () => {
    dispatch(setPage(page + 1));
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
                Loading tokens...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-red-500">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && tokens.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No tokens in watchlist
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            tokens.map((t) => {
              const value = t.holdings * t.price;
              return (
                <tr key={t.id} className="border-b">
                  <td className="px-4 py-2 font-medium">
                    {t.name} ({t.symbol.toUpperCase()})
                  </td>
                  <td className="px-4 py-2">${t.price.toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${t.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {t.change24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 w-32">
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
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={t.holdings}
                      onChange={(e) =>
                        handleHoldingsChange(t.id, e.target.value)
                      }
                      className="w-20 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">${value.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => dispatch(removeToken(t.id))}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Pagination footer */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-3 py-1 rounded ${page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {page} (showing {perPage} tokens)
        </span>
        <button
          onClick={handleNext}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WatchlistTable;
