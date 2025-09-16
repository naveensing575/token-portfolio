import{ useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMarketTokens } from "./features/watchlist/watchlistSlice";
import type { AppDispatch } from "./store/store";
import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/WatchlistTable";
import AddTokenModal from "./components/AddTokenModal";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMarketTokens(1));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Token Portfolio</h1>

      <PortfolioCard />

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Token
        </button>
      </div>

      <WatchlistTable />

      <AddTokenModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
