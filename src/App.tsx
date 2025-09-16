import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMarketTokens } from "./features/watchlist/watchlistSlice";
import type { AppDispatch } from "./store/store";
import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/WatchlistTable";
import AddTokenModal from "./components/AddTokenModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMarketTokens(1));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with wallet connect */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Portfolio</h1>
        <ConnectButton />
      </div>

      {/* Portfolio summary */}
      <PortfolioCard />

      {/* Watchlist with Add Token */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        <AddTokenModal />
      </div>

      <WatchlistTable />
    </div>
  );
}

export default App;
