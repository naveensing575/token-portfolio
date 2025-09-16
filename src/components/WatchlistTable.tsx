import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { updateHoldings, removeToken } from "../features/watchlist/watchlistSlice";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useSelector((state: RootState) => state.watchlist);

  const handleHoldingsChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    dispatch(updateHoldings({ id, holdings: num }));
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
          {tokens.map((t) => {
            const value = t.holdings * t.price;
            return (
              <tr key={t.id} className="border-b">
                <td className="px-4 py-2 font-medium">{t.name} ({t.symbol.toUpperCase()})</td>
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
                    onChange={(e) => handleHoldingsChange(t.id, e.target.value)}
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
    </div>
  );
};

export default WatchlistTable;
