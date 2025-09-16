import { useDispatch } from "react-redux";
import { refreshPrices } from "../features/watchlist/watchlistSlice";
import type { AppDispatch } from "../store/store";

function WatchlistHeader() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex justify-between items-center mt-6">
      <h2 className="text-lg font-semibold">Watchlist</h2>
      <button
        onClick={() => dispatch(refreshPrices())}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Refresh Prices
      </button>
    </div>
  );
}

export default WatchlistHeader;
