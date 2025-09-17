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

// Chart colors optimized for accessibility and design consistency
const CHART_COLORS = [
  "#10B981", // Emerald - Primary green
  "#8B5CF6", // Violet - Secondary purple
  "#06B6D4", // Cyan - Tertiary blue
  "#F59E0B", // Amber - Warning yellow
  "#EF4444", // Red - Danger red
  "#3B82F6", // Blue - Info blue
  "#F97316", // Orange - Accent orange
  "#84CC16", // Lime - Success lime
] as const;

interface ChartDataItem {
  name: string;
  fullName: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface EmptyStateProps {
  isMobile?: boolean;
}

// Reusable Empty State Component
const EmptyState: React.FC<EmptyStateProps> = ({ isMobile = false }) => (
  <div className={`flex flex-col items-center justify-center text-gray-400 ${isMobile ? "py-12" : "h-80"
    }`}>
    <div className={`bg-gray-700 rounded-full flex items-center justify-center mb-4 ${isMobile ? "w-16 h-16" : "w-20 h-20"
      }`}>
      <span className={isMobile ? "text-2xl" : "text-4xl"}>📊</span>
    </div>
    <div className={`font-medium text-gray-300 mb-1 ${isMobile ? "text-lg" : "text-xl"
      }`}>
      No Holdings
    </div>
    <div className="text-sm text-gray-500 text-center max-w-xs">
      {isMobile
        ? "Add tokens and set holdings"
        : "Add tokens and set holdings to see your portfolio breakdown"
      }
    </div>
  </div>
);

// Legend Item Component for better reusability
interface LegendItemProps {
  token: ChartDataItem;
  isMobile?: boolean;
}

const LegendItem: React.FC<LegendItemProps> = ({ token, isMobile = false }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: token.color }}
      />
      <span className={`text-white font-medium truncate ${isMobile ? "text-sm" : "text-sm"
        }`}>
        {isMobile
          ? `${token.fullName} (${token.name})`
          : `${token.fullName} (${token.name})`
        }
      </span>
    </div>
    <div className={`text-white font-semibold flex-shrink-0 ml-4 ${isMobile ? "text-sm" : "text-sm"
      }`}>
      {token.percentage.toFixed(1)}%
    </div>
  </div>
);

const PortfolioCard: React.FC = () => {
  const tokens = useSelector(selectWatchlistTokens);
  const portfolioTotal = useSelector(selectPortfolioTotal);
  const lastUpdated = useSelector(selectLastUpdated);

  // Memoized calculations for performance
  const tokensWithHoldings = React.useMemo(
    () => tokens.filter((token) => token.holdings > 0),
    [tokens]
  );

  const chartData: ChartDataItem[] = React.useMemo(() => {
    return tokensWithHoldings.map((token, index) => ({
      name: token.symbol.toUpperCase(),
      fullName: token.name,
      value: token.holdings * token.price,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percentage: portfolioTotal > 0 ? ((token.holdings * token.price) / portfolioTotal) * 100 : 0
    }));
  }, [tokensWithHoldings, portfolioTotal]);

  // Memoized formatters for performance
  const formatCurrency = React.useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatTime = React.useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const hasHoldings = chartData.length > 0;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="p-6">
          {/* Portfolio Header */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Portfolio Total</h2>
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(portfolioTotal)}
            </div>
          </div>

          {/* Chart Section */}
          {!hasHoldings ? (
            <EmptyState isMobile />
          ) : (
            <div>
              {/* Mobile Chart */}
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
                          <Cell key={`mobile-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mobile Legend */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Portfolio Breakdown</h3>
                {chartData.map((token, index) => (
                  <LegendItem key={`mobile-legend-${index}`} token={token} isMobile />
                ))}
              </div>
            </div>
          )}

          {/* Mobile Last Updated */}
          {lastUpdated && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-500">
                Last updated: {formatTime(lastUpdated)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start min-h-[320px]">
          {/* Portfolio Total Value */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">Portfolio Total</h2>
              <div className="text-5xl font-bold text-white leading-tight">
                {formatCurrency(portfolioTotal)}
              </div>
            </div>

            {/* Desktop Last Updated - Bottom Left */}
            {lastUpdated && (
              <div className="mt-auto pt-6">
                <div className="text-sm text-gray-500">
                  Last updated: {formatTime(lastUpdated)}
                </div>
              </div>
            )}
          </div>

          {/* Chart and Legend Section */}
          <div className="h-full">
            {!hasHoldings ? (
              <EmptyState />
            ) : (
              <div className="flex items-start gap-8">
                {/* Chart Section - Left Side */}
                <div className="flex-shrink-0">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Portfolio Total</h3>
                  <div className="w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`desktop-cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Legend - Right Side */}
                <div className="flex-1 pt-8">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Portfolio Breakdown</h3>
                  <div className="space-y-4">
                    {chartData.map((token, index) => (
                      <LegendItem key={`desktop-legend-${index}`} token={token} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;