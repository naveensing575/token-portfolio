export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
  holdings: number;
}
