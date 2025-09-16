import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch } from "react-redux";
import { addToken } from "../features/watchlist/watchlistSlice";
import { searchTokens, getTrendingTokens, getTokenPricesByIds } from "../services/coingecko";
import type { AppDispatch } from "../store/store";
import type { SearchToken, TrendingToken } from "../services/types";

const AddTokenModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchToken[]>([]);
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getTrendingTokens().then(setTrending).catch(console.error);
    }
  }, [open]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length > 1) {
      try {
        const res = await searchTokens(q);
        setResults(res.slice(0, 10)); // Limit results
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleAdd = async () => {
    if (!selected || loading) return;

    setLoading(true);
    try {
      // Get the selected token
      const token = results.find((t) => t.id === selected) ||
        trending.find((t) => t.id === selected);

      if (!token) return;

      // Fetch current market data for the token
      const marketData = await getTokenPricesByIds([token.id]);
      const tokenData = marketData[0];

      if (tokenData) {
        dispatch(addToken({
          id: tokenData.id,
          name: tokenData.name,
          symbol: tokenData.symbol,
          image: tokenData.image,
          price: tokenData.current_price,
          change24h: tokenData.price_change_percentage_24h,
          sparkline: tokenData.sparkline_in_7d?.price || [],
          holdings: 0,
        }));
      } else {
        // Fallback if market data fails
        dispatch(addToken({
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          image: 'thumb' in token ? token.thumb : '',
          price: 0,
          change24h: 0,
          sparkline: [],
          holdings: 0,
        }));
      }

      // Reset and close
      setSelected(null);
      setQuery("");
      setResults([]);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add token:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Token
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none overflow-y-auto">
          <Dialog.Title className="text-lg font-bold mb-4">
            Add Token
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-600">
            Search or pick trending tokens to add to your watchlist.
          </Dialog.Description>

          <input
            type="text"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {query.length < 2 && trending.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Trending</h3>
              <div className="max-h-60 overflow-y-auto">
                {trending.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={t.thumb}
                        alt={t.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <span className="font-medium">{t.name}</span>
                        <span className="text-gray-500 ml-1">({t.symbol.toUpperCase()})</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="token"
                      value={t.id}
                      checked={selected === t.id}
                      onChange={() => setSelected(t.id)}
                      className="text-blue-600"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Search Results</h3>
              <div className="max-h-60 overflow-y-auto">
                {results.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={t.thumb}
                        alt={t.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <span className="font-medium">{t.name}</span>
                        <span className="text-gray-500 ml-1">({t.symbol.toUpperCase()})</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="token"
                      value={t.id}
                      checked={selected === t.id}
                      onChange={() => setSelected(t.id)}
                      className="text-blue-600"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleAdd}
              disabled={!selected || loading}
              className={`px-4 py-2 rounded text-white min-w-[120px] ${selected && !loading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? "Adding..." : "Add to Watchlist"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddTokenModal;