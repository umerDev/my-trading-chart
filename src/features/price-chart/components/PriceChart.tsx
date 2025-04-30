import React, { useState, useEffect } from 'react';
import { PriceChartProps, PriceChartState, PriceChartActions } from '../types';
import { useTradingService } from '../../../app/providers/trading-provider';
import { PriceChart as PriceChartComponent } from '../../../shared/components';

export const PriceChart: React.FC<PriceChartProps> = ({ symbol, interval }) => {
  const [state, setState] = useState<PriceChartState>({
    market: null,
    trades: [],
    isLoading: true,
    error: null,
  });

  const tradingService = useTradingService();

  const actions: PriceChartActions = {
    fetchMarketData: async () => {
      try {
        const market = await tradingService.getMarket(symbol);
        setState(prev => ({ ...prev, market, isLoading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      }
    },
    fetchTrades: async () => {
      try {
        const trades = await tradingService.getTrades(symbol, 100);
        setState(prev => ({ ...prev, trades }));
      } catch (error) {
        setState(prev => ({ ...prev, error: error.message }));
      }
    },
    changeInterval: (newInterval) => {
      setState(prev => ({ ...prev, isLoading: true }));
      // Additional logic for interval change
    },
  };

  useEffect(() => {
    actions.fetchMarketData();
    actions.fetchTrades();
  }, [symbol, interval]);

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <PriceChartComponent
      market={state.market!}
      trades={state.trades}
      interval={interval}
    />
  );
};