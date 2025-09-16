import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getMarketTokens, getTokenPricesByIds } from "../../services/coingecko";
import type { RootState } from "../../store/store";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
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
  marketTokens: Token[];
  marketLoading: boolean;
  marketPage: number;
  marketPerPage: number;
}

export const initialState: WatchlistState = {
  tokens: [],
  lastUpdated: null,
  loading: false,
  error: null,
  marketTokens: [],
  marketLoading: false,
  marketPage: 1,
  marketPerPage: 10,
};

export const fetchMarketTokens = createAsyncThunk(
  "watchlist/fetchMarketTokens",
  async (page: number = 1) => {
    return await getMarketTokens(page, 10);
  }
);

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
      if (!existing) {
        state.tokens.push({ ...action.payload, holdings: 0 });
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
    setMarketPage: (state, action: PayloadAction<number>) => {
      state.marketPage = Math.max(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMarketTokens.pending, (state) => {
      state.marketLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMarketTokens.fulfilled, (state, action) => {
      state.marketLoading = false;
      state.marketTokens = action.payload.map((t) => ({
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        image: t.image,
        price: t.current_price,
        change24h: t.price_change_percentage_24h,
        sparkline: t.sparkline_in_7d?.price || [],
        holdings: 0,
      }));
    });
    builder.addCase(fetchMarketTokens.rejected, (state, action) => {
      state.marketLoading = false;
      state.error = action.error.message || "Failed to fetch tokens";
    });

    builder.addCase(refreshPrices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(refreshPrices.fulfilled, (state, action) => {
      state.loading = false;
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
    builder.addCase(refreshPrices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to refresh prices";
    });
  },
});

// Selectors
export const selectWatchlistTokens = (state: RootState) => state.watchlist.tokens;
export const selectMarketTokens = (state: RootState) => state.watchlist.marketTokens;
export const selectMarketLoading = (state: RootState) => state.watchlist.marketLoading;
export const selectLoading = (state: RootState) => state.watchlist.loading;
export const selectLastUpdated = (state: RootState) => state.watchlist.lastUpdated;

export const selectPortfolioTotal = (state: RootState) => {
  return state.watchlist.tokens.reduce((total, token) => {
    return total + (token.holdings * token.price);
  }, 0);
};

export const selectTokenValue = (tokenId: string) => (state: RootState) => {
  const token = state.watchlist.tokens.find(t => t.id === tokenId);
  return token ? token.holdings * token.price : 0;
};

export const {
  addToken,
  updateHoldings,
  removeToken,
  setMarketPage,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;