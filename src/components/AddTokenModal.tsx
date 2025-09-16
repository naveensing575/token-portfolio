import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { addToken } from "../features/watchlist/watchlistSlice";
import { searchTokens, getTrendingTokens } from "../services/coingecko";
import type { AppDispatch } from "../store/store";
import type { SearchToken, TrendingToken } from "../services/types";

interface AddTokenModalProps {
  open: boolean;
  onClose: () => void;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchToken[]>([]);
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      getTrendingTokens().then(setTrending);
    }
  }, [open]);

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
    const token = [...results, ...trending].find((t) => t.id === selected);
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
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-lg p-6 w-full max-w-lg z-20">
          <Dialog.Title className="text-lg font-bold mb-4">Add Token</Dialog.Title>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search token..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Trending Section */}
          {query.length < 2 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Trending</h3>
              <ul>
                {trending.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-2">
                    <span>{t.name} ({t.symbol.toUpperCase()})</span>
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

          {/* Search Results */}
          {results.length > 0 && (
            <ul className="mb-4">
              {results.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2">
                  <span>{t.name} ({t.symbol.toUpperCase()})</span>
                  <input
                    type="radio"
                    name="token"
                    checked={selected === t.id}
                    onChange={() => setSelected(t.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selected}
              className={`px-4 py-2 rounded text-white ${selected ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddTokenModal;
