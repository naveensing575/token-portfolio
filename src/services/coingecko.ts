import axios from "axios";
import type { MarketToken, SearchToken, TrendingToken } from "./types";

const API_BASE = "https://api.coingecko.com/api/v3";

// 🔹 Fetch top coins with market data
export const getMarketTokens = async (
  page = 1,
  perPage = 10
): Promise<MarketToken[]> => {
  const { data } = await axios.get<MarketToken[]>(`${API_BASE}/coins/markets`, {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: "24h",
    },
  });
  return data;
};

export const getTokenPricesByIds = async (
  ids: string[]
): Promise<MarketToken[]> => {
  if (ids.length === 0) return [];
  const { data } = await axios.get<MarketToken[]>(`${API_BASE}/coins/markets`, {
    params: {
      vs_currency: "usd",
      ids: ids.join(","),
      sparkline: true,
      price_change_percentage: "24h",
    },
  });
  return data;
};


// 🔹 Search tokens by query
export const searchTokens = async (query: string): Promise<SearchToken[]> => {
  const { data } = await axios.get<{ coins: SearchToken[] }>(
    `${API_BASE}/search`,
    {
      params: { query },
    }
  );
  return data.coins;
};

// 🔹 Get trending tokens
export const getTrendingTokens = async (): Promise<TrendingToken[]> => {
  const { data } = await axios.get<{ coins: { item: TrendingToken }[] }>(
    `${API_BASE}/search/trending`
  );
  return data.coins.map((c) => c.item);
};

// 🔹 Get price updates for specific IDs
export const getPrices = async (
  ids: string[]
): Promise<Record<string, { usd: number; usd_24h_change: number; last_updated_at: number }>> => {
  const { data } = await axios.get(
    `${API_BASE}/simple/price`,
    {
      params: {
        ids: ids.join(","),
        vs_currencies: "usd",
        include_24hr_change: "true",
        include_last_updated_at: "true",
      },
    }
  );
  return data;
};
