import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Token } from "./types";
import { getMarketTokens, getPrices } from "../../services/coingecko";

export const fetchMarketTokens = createAsyncThunk(
  "watchlist/fetchMarketTokens",
  async (page: number = 1) => {
    const data = await getMarketTokens(page, 10);
    return data;
  }
);

export const refreshPrices = createAsyncThunk(
  "watchlist/refreshPrices",
  async (ids: string[]) => {
    const data = await getPrices(ids);
    return data;
  }
);

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

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<Token>) => {
      state.tokens.push(action.payload);
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
    builder
      .addCase(fetchMarketTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.map((t) => ({
          id: t.id,
          name: t.name,
          symbol: t.symbol,
          price: t.current_price,
          change24h: t.price_change_percentage_24h,
          sparkline: t.sparkline_in_7d.price,
          holdings: 2,
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMarketTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tokens";
      })
      .addCase(refreshPrices.fulfilled, (state, action) => {
        Object.entries(action.payload).forEach(([id, val]) => {
          const token = state.tokens.find((t) => t.id === id);
          if (token) {
            token.price = val.usd;
            token.change24h = val.usd_24h_change;
          }
        });
        state.lastUpdated = new Date().toISOString();
      });
  },
});

export const { addToken, updateHoldings, removeToken } = watchlistSlice.actions;
export default watchlistSlice.reducer;
