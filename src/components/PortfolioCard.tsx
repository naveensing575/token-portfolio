import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const PortfolioCard: React.FC = () => {
  const { tokens, lastUpdated } = useSelector(
    (state: RootState) => state.watchlist
  );

  const chartData = tokens.map((t) => ({
    name: t.symbol.toUpperCase(),
    value: t.holdings * t.price,
  }));

  const total = chartData.reduce((sum, t) => sum + t.value, 0);

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-3xl">
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
        </div>

        {/* Right: Donut Chart */}
        <div className="w-48 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
