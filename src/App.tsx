import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMarketTokens } from "./features/watchlist/watchlistSlice";
import type { AppDispatch } from "./store/store";
import PortfolioCard from "./components/PortfolioCard";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMarketTokens(1));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Token Portfolio</h1>
      <PortfolioCard />
    </div>
  );
}

export default App;
