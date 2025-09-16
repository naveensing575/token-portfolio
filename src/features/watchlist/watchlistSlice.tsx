import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
}

export const initialState: WatchlistState = {
  tokens: [],
  lastUpdated: null,
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
    setPrices: (state, action: PayloadAction<{ id: string; price: number; change24h: number; sparkline: number[] }[]>) => {
      action.payload.forEach(update => {
        const token = state.tokens.find((t) => t.id === update.id);
        if (token) {
          token.price = update.price;
          token.change24h = update.change24h;
          token.sparkline = update.sparkline;
        }
      });
      state.lastUpdated = new Date().toISOString();
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToken, updateHoldings, setPrices, removeToken } =
  watchlistSlice.actions;

export default watchlistSlice.reducer;
