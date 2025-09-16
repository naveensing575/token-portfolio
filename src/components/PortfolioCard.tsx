import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
import { useAccount, useBalance } from "wagmi";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const WalletBalance: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data, isLoading, error } = useBalance({
    address,
    query: {
      refetchInterval: 10000, // auto refresh every 10s
    },
  });

  if (!isConnected) return null;

  if (isLoading) {
    return <p className="text-sm text-gray-500">Fetching ETH balance...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">Error loading balance</p>;
  }

  return (
    <p className="text-sm text-gray-500 mt-1">
      Wallet Balance: {data?.formatted} {data?.symbol}
    </p>
  );
};

const PortfolioCard: React.FC = () => {
  const { tokens, lastUpdated } = useSelector(
    (state: RootState) => state.watchlist
  );

  // ✅ Only include tokens with holdings > 0
  const chartData = tokens
    .filter((t) => t.holdings > 0)
    .map((t) => ({
      name: t.symbol.toUpperCase(),
      value: t.holdings * t.price,
    }));

  const total = chartData.reduce((sum, t) => sum + t.value, 0);

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-5xl">
      <h2 className="text-lg font-semibold mb-4">Portfolio Total</h2>

      <div className="flex flex-col md:flex-row items-center md:justify-between">
        {/* Left: Total */}
        <div>
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
          {/* Wallet Balance */}
          <WalletBalance />
        </div>

        {/* Right: Donut Chart with Legend */}
        <div className="w-full md:w-1/2 flex justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value: string, entry: LegendPayload) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const val = (entry.payload as any)?.value ?? 0;
                  const percent =
                    total > 0 ? ((val / total) * 100).toFixed(1) : "0";
                  return `${value} (${percent}% – $${val.toFixed?.(2) ?? val})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
