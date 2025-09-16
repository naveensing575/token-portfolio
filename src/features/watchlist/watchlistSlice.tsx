import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getMarketTokens, getTokenPricesByIds } from "../../services/coingecko";
import type { RootState } from "../../store/store";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
  holdings: number;
}

interface WatchlistState {
  tokens: Token[];
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: WatchlistState = {
  tokens: [],
  lastUpdated: null,
  loading: false,
  error: null,
};

// Fetch top market tokens (paginated)
export const fetchMarketTokens = createAsyncThunk(
  "watchlist/fetchMarketTokens",
  async (page: number) => {
    return await getMarketTokens(page);
  }
);

// Refresh prices for tokens already in watchlist
export const refreshPrices = createAsyncThunk(
  "watchlist/refreshPrices",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const tokenIds = state.watchlist.tokens.map((t) => t.id);
    if (tokenIds.length === 0) return [];
    return await getTokenPricesByIds(tokenIds);
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<Token>) => {
      const existing = state.tokens.find((t) => t.id === action.payload.id);
      if (existing) {
        // Update symbol/name in case they changed, keep holdings
        existing.name = action.payload.name;
        existing.symbol = action.payload.symbol;
        // Don’t overwrite holdings here unless you want to reset them
      } else {
        state.tokens.push(action.payload);
      }
    },
    updateHoldings: (
      state,
      action: PayloadAction<{ id: string; holdings: number }>
    ) => {
      const token = state.tokens.find((t) => t.id === action.payload.id);
      if (token) {
        token.holdings = action.payload.holdings;
      }
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch market tokens
    builder.addCase(fetchMarketTokens.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMarketTokens.fulfilled, (state, action) => {
      state.loading = false;
      state.tokens = action.payload.map((t) => ({
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        price: t.current_price,
        change24h: t.price_change_percentage_24h,
        sparkline: t.sparkline_in_7d?.price || [],
        holdings: 0,
      }));
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(fetchMarketTokens.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch tokens";
    });

    // Refresh prices
    builder.addCase(refreshPrices.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        action.payload.forEach((update) => {
          const token = state.tokens.find((t) => t.id === update.id);
          if (token) {
            token.price = update.current_price;
            token.change24h = update.price_change_percentage_24h;
            token.sparkline = update.sparkline_in_7d?.price || [];
          }
        });
        state.lastUpdated = new Date().toISOString();
      }
    });
  },
});

export const { addToken, updateHoldings, removeToken } =
  watchlistSlice.actions;

export default watchlistSlice.reducer;
