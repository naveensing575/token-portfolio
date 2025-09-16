import React from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  selectPortfolioTotal,
  selectWatchlistTokens,
  selectLastUpdated
} from "../features/watchlist/watchlistSlice";

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
];

const PortfolioCard: React.FC = () => {
  const tokens = useSelector(selectWatchlistTokens);
  const portfolioTotal = useSelector(selectPortfolioTotal);
  const lastUpdated = useSelector(selectLastUpdated);

  const tokensWithHoldings = tokens.filter((t) => t.holdings > 0);

  const chartData = tokensWithHoldings.map((t, index) => ({
    name: t.symbol.toUpperCase(),
    fullName: t.name,
    value: t.holdings * t.price,
    color: COLORS[index % COLORS.length],
    percentage: portfolioTotal > 0 ? ((t.holdings * t.price) / portfolioTotal) * 100 : 0
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white md:bg-slate-800 rounded-xl md:rounded-2xl shadow-sm md:shadow-none border md:border-0 border-gray-200 overflow-hidden">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="p-6">
          {/* Portfolio Header */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Portfolio Total</h2>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(portfolioTotal)}
            </div>
            {lastUpdated && (
              <div className="text-xs text-gray-400">
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
          </div>

          {/* Chart Section */}
          {tokensWithHoldings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-lg font-medium text-gray-600 mb-1">No Holdings</div>
              <div className="text-sm text-gray-400">Add tokens and set holdings</div>
            </div>
          ) : (
            <div>
              {/* Chart */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {chartData.map((token, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: token.color }}
                      />
                      <span className="text-gray-900 font-medium text-sm">
                        {token.fullName}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 font-semibold text-sm">
                        {formatCurrency(token.value)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {token.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Portfolio Total Value */}
          <div>
            <h2 className="text-lg font-medium text-gray-400 mb-4">Portfolio Total</h2>
            <div className="text-5xl font-bold text-white mb-4">
              {formatCurrency(portfolioTotal)}
            </div>
            {lastUpdated && (
              <div className="text-sm text-gray-400">
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
          </div>

          {/* Chart and Legend */}
          {tokensWithHoldings.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-lg font-medium">No Holdings</div>
                <div className="text-sm">Add tokens and set holdings to see your portfolio breakdown</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              {/* Donut Chart */}
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-400 mb-6">Portfolio Breakdown</h3>
                <div className="space-y-3">
                  {chartData.map((token, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: token.color }}
                        />
                        <span className="text-white font-medium">
                          {token.fullName}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {formatCurrency(token.value)}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {token.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;