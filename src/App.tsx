import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMarketTokens } from "./features/watchlist/watchlistSlice";
import type { AppDispatch } from "./store/store";
import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/WatchlistTable";
import AddTokenModal from "./components/AddTokenModal";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMarketTokens(1));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Token Portfolio</h1>

      <PortfolioCard />

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        {/* Add Token button is now part of the modal itself */}
        <AddTokenModal />
      </div>

      <WatchlistTable />
    </div>
  );
}

export default App;
