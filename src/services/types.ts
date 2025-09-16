// Market tokens (used in portfolio + table)
export interface MarketToken {
  price: number;
  change24h: number;
  sparkline: number[];
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

// Token search result
export interface SearchToken {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  large: string;
}

// Trending token item
export interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}
