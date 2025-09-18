import { useDispatch, useSelector } from "react-redux";
import { refreshPrices, selectLoading, selectWatchlistTokens } from "../../features/watchlist/watchlistSlice";
import type { AppDispatch } from "../../store/store";
import AddTokenModal from "../AddTokenModal";
import { RefreshCw } from "lucide-react";
import starSvg from "../../assets/star.svg";

function WatchlistHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectLoading);
  const tokens = useSelector(selectWatchlistTokens);

  const handleRefresh = () => {
    if (tokens.length === 0) {
      return;
    }
    dispatch(refreshPrices());
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="block md:hidden mb-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={starSvg}
              alt="Star"
              className="w-5 h-5"
            />
            <h2 className="text-lg font-semibold text-white">Watchlist</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading || tokens.length === 0}
              className={`flex items-center justify-center p-2 rounded-lg transition-colors ${loading || tokens.length === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              <RefreshCw
                size={16}
                className={`${loading ? "animate-spin" : ""} transition-transform`}
              />
            </button>
            <AddTokenModal />
          </div>
        </div>
        {/* Mobile Table Headers */}
        <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-700">
          <div>Token</div>
          <div className="text-right">Price</div>
          <div className="text-right">Value</div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex justify-between items-center mb-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <img
            src={starSvg}
            alt="Star"
            className="w-7 h-7"
          />
          <h2 className="text-2xl font-semibold text-white">
            Watchlist
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading || tokens.length === 0}
            className={`flex items-center gap-2 bg-[#27272A] px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${loading || tokens.length === 0
                ? "text-gray-500"
                : "text-gray-300 hover:text-white"
              }`}
          >
            <RefreshCw
              size={16}
              className={`${loading ? "animate-spin" : ""} transition-transform`}
            />
            <span>
              {loading ? "Refreshing..." : "Refresh Prices"}
            </span>
          </button>

          {/* Add Token Modal */}
          <AddTokenModal />
        </div>
      </div>
    </>
  );
}

export default WatchlistHeader;