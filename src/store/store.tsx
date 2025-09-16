import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer, { initialState as watchlistInitialState } from "../features/watchlist/watchlistSlice";
import { loadState, saveState } from "../utils/localStorage";

const PERSIST_KEY = "watchlistState";

// Load persisted or fallback to initialState
const persistedWatchlist = loadState<typeof watchlistInitialState>(PERSIST_KEY) ?? watchlistInitialState;

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
  preloadedState: {
    watchlist: persistedWatchlist,
  },
});

// Subscribe to changes
store.subscribe(() => {
  saveState(PERSIST_KEY, store.getState().watchlist);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
