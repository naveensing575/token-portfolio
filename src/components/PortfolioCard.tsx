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
  [key: string]: string | number;
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
}

const LegendItem: React.FC<LegendItemProps> = ({ token }) => (
  <div className="flex items-center justify-between py-0.5">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: token.color }}
      />
      <span
        className="font-medium text-xs truncate"
        style={{ color: token.color }}
      >
        {token.fullName} ({token.name})
      </span>
    </div>
    <div className="text-white font-semibold text-xs flex-shrink-0 ml-3">
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
    <div className="bg-[#27272A] rounded-xl shadow-lg border border-gray-700 overflow-hidden mt-10">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="p-6">
          {/* Portfolio Header */}
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Portfolio Total</h2>
            <div className="text-3xl font-bold text-white mb-4">
              {formatCurrency(portfolioTotal)}
            </div>
            {/* Mobile Last Updated */}
            {lastUpdated && (
              <div className="text-xs text-gray-500">
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
          </div>

          {/* Chart Section */}
          {!hasHoldings ? (
            <EmptyState isMobile />
          ) : (
            <div>
              {/* Mobile Chart Header */}
              <h3 className="text-sm font-medium text-gray-400 mb-6">Portfolio Total</h3>

              {/* Mobile Chart */}
              <div className="flex justify-center mb-8">
                <div className="w-56 h-56" style={{ pointerEvents: 'none' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={105}
                        paddingAngle={2}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`mobile-cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={1}
                            style={{ outline: 'none', cursor: 'default' }}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mobile Legend */}
              <div className="space-y-3">
                {chartData.map((token, index) => (
                  <div key={`mobile-legend-${index}`} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: token.color }}
                      />
                      <span
                        className="font-medium text-sm truncate"
                        style={{ color: token.color }}
                      >
                        {token.fullName} ({token.name})
                      </span>
                    </div>
                    <div className="text-white font-semibold text-sm flex-shrink-0 ml-4">
                      {token.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block py-8 px-6">
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Portfolio Total Value */}
          <div className="flex flex-col h-full">
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-2">Portfolio Total</h2>
              <div className="text-5xl font-semi text-white leading-tight mb-15">
                {formatCurrency(portfolioTotal)}
              </div>
            </div>

            {/* Desktop Last Updated - Bottom Left */}
            {lastUpdated && (
              <div className="mt-auto">
                <div className="text-xs text-gray-500">
                  Last updated: {formatTime(lastUpdated)}
                </div>
              </div>
            )}
          </div>

          {/* Chart and Legend Section */}
          <div className="flex items-start gap-6">
            {!hasHoldings ? (
              <EmptyState />
            ) : (
              <>
                {/* Chart Section */}
                <div className="flex-shrink-0">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Portfolio Total</h3>
                  <div className="w-45 h-45" style={{ pointerEvents: 'none' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={85}
                          paddingAngle={1}
                          dataKey="value"
                          isAnimationActive={false}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`desktop-cell-${index}`}
                              fill={entry.color}
                              stroke="white"
                              strokeWidth={1}
                              style={{ outline: 'none', cursor: 'default' }}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Legend - Right Side */}
                <div className="flex-1 pt-10">
                  <div className="space-y-1">
                    {chartData.map((token, index) => (
                      <LegendItem key={`desktop-legend-${index}`} token={token} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;