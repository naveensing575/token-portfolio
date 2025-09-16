import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer, { initialState as watchlistInitialState, type Token } from "../features/watchlist/watchlistSlice";
import { loadState, saveState } from "../utils/localStorage";

const PERSIST_KEY = "watchlistState";

const persistedState = loadState<{ tokens: Token[]; lastUpdated: string | null }>(PERSIST_KEY);
const preloadedWatchlistState = persistedState
  ? { ...watchlistInitialState, ...persistedState }
  : watchlistInitialState;

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
  preloadedState: {
    watchlist: preloadedWatchlistState,
  },
});

store.subscribe(() => {
  const { tokens, lastUpdated } = store.getState().watchlist;
  saveState(PERSIST_KEY, { tokens, lastUpdated });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;