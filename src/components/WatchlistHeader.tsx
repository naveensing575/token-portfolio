import { useDispatch, useSelector } from "react-redux";
import { refreshPrices, selectLoading, selectWatchlistTokens } from "../features/watchlist/watchlistSlice";
import type { AppDispatch } from "../store/store";
import AddTokenModal from "./AddTokenModal";
import { RefreshCw } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="text-green-500 text-xl">⭐</span>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 md:text-white">
          Watchlist
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading || tokens.length === 0}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${loading || tokens.length === 0
              ? "bg-gray-100 md:bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 md:bg-gray-600 text-gray-700 md:text-white hover:bg-gray-200 md:hover:bg-gray-500 active:scale-95"
            }`}
        >
          <RefreshCw
            size={16}
            className={`${loading ? "animate-spin" : ""} transition-transform`}
          />
          <span className="hidden sm:inline">
            {loading ? "Refreshing..." : "Refresh Prices"}
          </span>
          <span className="sm:hidden">
            {loading ? "Loading..." : "Refresh"}
          </span>
        </button>

        {/* Add Token Modal */}
        <div className="flex-1 sm:flex-none">
          <AddTokenModal />
        </div>
      </div>
    </div>
  );
}

export default WatchlistHeader;