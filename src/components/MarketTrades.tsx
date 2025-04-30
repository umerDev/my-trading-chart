
import React, { useState, useEffect, useRef } from 'react';
import { ChartCandlestick } from 'lucide-react';

interface Trade {
  id: number;
  price: number;
  amount: number;
  time: Date;
  type: 'buy' | 'sell';
}

interface MarketTradesProps {
  symbol: string;
}

const MarketTrades: React.FC<MarketTradesProps> = ({ symbol }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);
  
  useEffect(() => {
    // Generate initial trades when symbol changes
    const initialTrades: Trade[] = [];
    const basePrice = getBasePriceForSymbol(symbol);
    
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (Math.random() * 200 - 100);
      const trade: Trade = {
        id: i,
        price,
        amount: 0.001 + Math.random() * 0.5,
        time: new Date(Date.now() - (i * 30000)),
        type: Math.random() > 0.5 ? 'buy' : 'sell'
      };
      initialTrades.push(trade);
    }
    
    setTrades(initialTrades);
    
    // Add new trades periodically
    const interval = setInterval(() => {
      const lastPrice = trades.length > 0 ? trades[0].price : basePrice;
      const newPrice = lastPrice + (Math.random() * 20 - 10);
      
      const newTrade: Trade = {
        id: Date.now(),
        price: newPrice,
        amount: 0.001 + Math.random() * 0.5,
        time: new Date(),
        type: Math.random() > 0.5 ? 'buy' : 'sell'
      };
      
      setTrades(prev => [newTrade, ...prev.slice(0, 99)]);
      
      if (autoScroll.current && containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [symbol]); // Re-run effect when symbol changes
  
  const getBasePriceForSymbol = (sym: string): number => {
    const basePrices: Record<string, number> = {
      'BTC/USD': 45000,
      'ETH/USD': 2800,
      'SOL/USD': 105,
      'BNB/USD': 520,
      'ADA/USD': 0.45,
      'XRP/USD': 0.55,
      'DOT/USD': 6.3,
      'DOGE/USD': 0.08
    };
    
    return basePrices[sym] || 1000;
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Extract currency symbol for displaying
  const getCurrencySymbol = (sym: string): string => {
    const parts = sym.split('/');
    return parts.length > 0 ? parts[0] : 'BTC';
  };
  
  const currency = getCurrencySymbol(symbol);
  
  return (
    <div className="trade-component h-full flex flex-col">
      <div className="trade-component-header">
        <div className="flex items-center gap-2">
          <ChartCandlestick size={16} />
          <span>Market Trades - {symbol}</span>
        </div>
      </div>
      <div className="flex text-xs text-muted-foreground p-2 border-b border-border">
        <div className="w-1/3">Price</div>
        <div className="w-1/3 text-right">Amount ({currency})</div>
        <div className="w-1/3 text-right">Time</div>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        onScroll={() => {
          if (containerRef.current) {
            autoScroll.current = containerRef.current.scrollTop === 0;
          }
        }}
      >
        {trades.map(trade => (
          <div 
            key={trade.id} 
            className={`flex text-xs p-2 border-b border-border/20 ${
              trade.type === 'buy' ? 'text-up' : 'text-down'
            }`}
          >
            <div className="w-1/3">{trade.price.toFixed(2)}</div>
            <div className="w-1/3 text-right">{trade.amount.toFixed(6)}</div>
            <div className="w-1/3 text-right">{formatTime(trade.time)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTrades;
