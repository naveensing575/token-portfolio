import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketTokens } from "./features/watchlist/watchlistSlice";
import type { RootState, AppDispatch } from "./store/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens, loading, error, lastUpdated } = useSelector(
    (state: RootState) => state.watchlist
  );

  useEffect(() => {
    dispatch(fetchMarketTokens(1));
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Token Portfolio</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {tokens.map((t) => (
          <li key={t.id}>
            {t.name} ({t.symbol.toUpperCase()}) - ${t.price.toFixed(2)}
          </li>
        ))}
      </ul>

      {lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default App;
