import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch } from "react-redux";
import { addToken } from "../features/watchlist/watchlistSlice";
import { searchTokens, getTrendingTokens, getTokenPricesByIds } from "../services/coingecko";
import type { AppDispatch } from "../store/store";
import type { SearchToken, TrendingToken } from "../services/types";
import { X, Star } from "lucide-react";

const AddTokenModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchToken[]>([]);
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
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
        setResults(res.slice(0, 10));
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const toggleSelection = (tokenId: string) => {
    setSelected(prev =>
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0 || loading) return;

    setLoading(true);
    try {
      for (const tokenId of selected) {
        const token = results.find((t) => t.id === tokenId) ||
          trending.find((t) => t.id === tokenId);

        if (!token) continue;

        try {
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
        } catch (error) {
          console.error(`Failed to add token ${token.name}:`, error);
        }
      }

      // Reset and close
      setSelected([]);
      setQuery("");
      setResults([]);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayList = query.length >= 2 ? results : trending;
  const listTitle = query.length >= 2 ? "Search Results" : "Trending";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2">
          <span className="text-lg">+</span>
          Add Token
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add Token
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-400 hover:text-white rounded">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4 sm:p-6">
            {/* Search Input */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                placeholder="Search tokens (e.g., ETH, SOL)..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Token List */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <h3 className="text-sm font-medium text-gray-300">{listTitle}</h3>
                {query.length < 2 && <Star size={14} className="text-yellow-500" />}
              </div>

              <div className="max-h-72 sm:max-h-80 overflow-y-auto space-y-1 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
                {displayList.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-400">
                    {query.length >= 2 ? "No tokens found" : "Loading trending tokens..."}
                  </div>
                ) : (
                  displayList.map((token) => {
                    const isSelected = selected.includes(token.id);
                    return (
                      <button
                        key={token.id}
                        onClick={() => toggleSelection(token.id)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-700/50 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img
                            src={token.thumb}
                            alt={token.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                          />
                          <div className="text-left min-w-0">
                            <div className="text-white font-medium text-sm sm:text-base group-hover:text-blue-400 transition-colors truncate">
                              {token.name}
                            </div>
                            <div className="text-gray-400 text-xs sm:text-sm font-medium">
                              {token.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isSelected && <Star size={16} className="text-green-400 fill-green-400" />}
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-500 group-hover:border-blue-400'
                            }`}>
                            {isSelected && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Count */}
            {selected.length > 0 && (
              <div className="mb-4 sm:mb-6 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <div className="text-blue-300 text-sm">
                  {selected.length} token{selected.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            )}

            {/* Footer Button */}
            <div className="mt-6 sm:mt-8">
              <button
                onClick={handleAdd}
                disabled={selected.length === 0 || loading}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-colors ${selected.length > 0 && !loading
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {loading ? "Adding..." : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddTokenModal;