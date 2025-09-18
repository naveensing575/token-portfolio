import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToken, selectWatchlistTokens } from "../features/watchlist/watchlistSlice";
import { searchTokens, getTrendingTokens, getTokenPricesByIds } from "../services/coingecko";
import type { AppDispatch } from "../store/store";
import type { SearchToken, TrendingToken } from "../services/types";
import { X, Star } from "lucide-react";

const AddTokenModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const existingTokens = useSelector(selectWatchlistTokens);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchToken[]>([]);
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Get existing token IDs for filtering
  const existingTokenIds = existingTokens.map(token => token.id);

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
        const token = filteredResults.find((t) => t.id === tokenId) ||
          filteredTrending.find((t) => t.id === tokenId);
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

  // Filter out tokens that are already in the watchlist
  const filteredResults = results.filter(token => !existingTokenIds.includes(token.id));
  const filteredTrending = trending.filter(token => !existingTokenIds.includes(token.id));

  const displayList = query.length >= 2 ? filteredResults : filteredTrending;
  const listTitle = query.length >= 2 ? "Search Results" : "Trending";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 bg-[#A9E851] hover:bg-[#98d147] text-black font-semibold px-4 py-1 rounded-lg transition-colors duration-200 shadow-lg">
          <span className="text-lg">+</span>
          Add Token
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl max-h-[85vh] bg-gray-800 rounded-xl border border-gray-700 shadow-2xl focus:outline-none overflow-hidden z-50 flex flex-col">
          {/* Header - Compact */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-700 flex-shrink-0">
            <Dialog.Title className="text-base md:text-lg font-semibold text-white">
              Add Token
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-3 md:p-4 flex flex-col min-h-0 flex-1">
            {/* Search Input - Compact */}
            <div className="relative mb-3 flex-shrink-0">
              <input
                type="text"
                placeholder="Search tokens (e.g., ETH, SOL)..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A9E851] focus:border-transparent"
              />
            </div>

            {/* Token List - Scrollable */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <h3 className="text-sm font-medium text-gray-300">{listTitle}</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
                {displayList.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    {query.length >= 2 ? "No tokens found" : "Loading trending tokens..."}
                  </div>
                ) : (
                  displayList.map((token) => {
                    const isSelected = selected.includes(token.id);
                    return (
                      <button
                        key={token.id}
                        onClick={() => toggleSelection(token.id)}
                        className="w-full flex items-center justify-between p-2.5 hover:bg-gray-700/60 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={token.thumb}
                            alt={token.name}
                            className="w-7 h-7 rounded-full flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23374151"/></svg>';
                            }}
                          />
                          <div className="text-left min-w-0 flex-1">
                            <div className="text-white font-medium text-sm truncate">
                              {token.name}
                            </div>
                            <div className="text-gray-400 text-xs font-medium">
                              {token.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isSelected && (
                            <Star size={14} className="text-[#A9E851] fill-[#A9E851]" />
                          )}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-[#A9E851] border-[#A9E851]'
                              : 'border-gray-500 group-hover:border-[#A9E851]'
                            }`}>
                            {isSelected && (
                              <div className="w-1.5 h-1.5 bg-black rounded-full" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer - Always Visible */}
            <div className="mt-3 flex-shrink-0">
              {/* Selected Count */}
              {selected.length > 0 && (
                <div className="mb-3 p-2.5 bg-[#A9E851]/10 border border-[#A9E851]/20 rounded-lg">
                  <div className="text-[#A9E851] text-sm font-medium">
                    {selected.length} token{selected.length !== 1 ? 's' : ''} selected
                  </div>
                </div>
              )}

              {/* Footer Button */}
              <button
                onClick={handleAdd}
                disabled={selected.length === 0 || loading}
                className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${selected.length > 0 && !loading
                    ? "bg-[#A9E851] hover:bg-[#98d147] text-black"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
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