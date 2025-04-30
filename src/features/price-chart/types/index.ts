import { Trade, Market } from '../../../domains/trading/entities';

export interface PriceChartProps {
  symbol: string;
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

export interface PriceChartState {
  market: Market | null;
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
}

export interface PriceChartActions {
  fetchMarketData: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  changeInterval: (interval: string) => void;
}