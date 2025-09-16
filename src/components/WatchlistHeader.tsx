import { useDispatch } from "react-redux";
import { refreshPrices } from "../features/watchlist/watchlistSlice";
import type { AppDispatch } from "../store/store";
import AddTokenModal from "./AddTokenModal";

function WatchlistHeader() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex justify-between items-center mt-6 mb-4">
      <h2 className="text-lg font-semibold">Watchlist</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(refreshPrices())}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Refresh Prices
        </button>
        <AddTokenModal />
      </div>
    </div>
  );
}

export default WatchlistHeader;
