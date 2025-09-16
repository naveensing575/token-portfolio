import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch } from "react-redux";
import { addToken } from "../features/watchlist/watchlistSlice";
import { searchTokens, getTrendingTokens } from "../services/coingecko";
import type { AppDispatch } from "../store/store";
import type { SearchToken, TrendingToken } from "../services/types";

const AddTokenModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchToken[]>([]);
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getTrendingTokens().then(setTrending);
  }, []);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length > 1) {
      const res = await searchTokens(q);
      setResults(res);
    } else {
      setResults([]);
    }
  };

  const handleAdd = () => {
    if (!selected) return;
    const token =
      results.find((t) => t.id === selected) ||
      trending.find((t) => t.id === selected);

    if (token) {
      dispatch(
        addToken({
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          price: 0,
          change24h: 0,
          sparkline: [],
          holdings: 0,
        })
      );
      setSelected(null);
      setQuery("");
    }
  };

  return (
    <Dialog.Root>
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

          {/* Search input */}
          <input
            type="text"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Trending tokens */}
          {query.length < 2 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Trending</h3>
              <ul>
                {trending.map((t) => (
                  <li
                    key={t.id}
                    className="flex justify-between py-2 items-center"
                  >
                    <span>
                      {t.name} ({t.symbol.toUpperCase()})
                    </span>
                    <input
                      type="radio"
                      name="token"
                      checked={selected === t.id}
                      onChange={() => setSelected(t.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search results */}
          {results.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Results</h3>
              <ul>
                {results.map((t) => (
                  <li
                    key={t.id}
                    className="flex justify-between py-2 items-center"
                  >
                    <span>
                      {t.name} ({t.symbol.toUpperCase()})
                    </span>
                    <input
                      type="radio"
                      name="token"
                      checked={selected === t.id}
                      onChange={() => setSelected(t.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-2 mt-4">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            </Dialog.Close>
            <button
              onClick={handleAdd}
              disabled={!selected}
              className={`px-4 py-2 rounded text-white ${selected
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Add to Watchlist
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddTokenModal;
