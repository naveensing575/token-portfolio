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
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-lg">⭐</span>
        <h2 className="text-xl font-semibold text-white">Watchlist</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleRefresh}
          disabled={loading || tokens.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${loading || tokens.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-500"
            }`}
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          <span className="hidden sm:inline">
            {loading ? "Refreshing..." : "Refresh Prices"}
          </span>
          <span className="sm:hidden">
            Refresh
          </span>
        </button>
        <AddTokenModal />
      </div>
    </div>
  );
}

export default WatchlistHeader;