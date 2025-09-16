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
  "#FF6B6B", // Red/Orange
  "#7C3AED", // Purple  
  "#06B6D4", // Cyan
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#14B8A6", // Teal
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
    <div className="bg-slate-800 rounded-lg p-4 sm:p-8 mb-6">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Portfolio Total */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-400 mb-2">Portfolio Total</h2>
          <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {formatCurrency(portfolioTotal)}
          </div>
          {lastUpdated && (
            <div className="text-sm text-gray-400">
              Last updated: {formatTime(lastUpdated)}
            </div>
          )}
        </div>

        {/* Chart and Legend Side by Side on Mobile */}
        {tokensWithHoldings.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <div className="text-base font-medium">No Holdings</div>
              <div className="text-sm">Add tokens and set holdings</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Compact Chart */}
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Compact Legend */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-400 mb-3">Portfolio Total</h3>
              <div className="space-y-2">
                {chartData.slice(0, 4).map((token, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: token.color }}
                      />
                      <span className="text-white font-medium truncate">
                        {token.name}
                      </span>
                    </div>
                    <span className="text-gray-300 font-medium ml-2">
                      {token.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {chartData.length > 4 && (
                  <div className="text-xs text-gray-400 pt-1">
                    +{chartData.length - 4} more tokens
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
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
                <h3 className="text-lg font-medium text-gray-400 mb-6">Portfolio Total</h3>
                <div className="space-y-3">
                  {chartData.map((token, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: token.color }}
                        />
                        <span className="text-white font-medium">
                          {token.fullName} ({token.name})
                        </span>
                      </div>
                      <span className="text-gray-300 font-medium">
                        {token.percentage.toFixed(1)}%
                      </span>
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