
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

type TradingHeaderProps = {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  onSymbolChange?: (symbol: string) => void;
};

const AVAILABLE_PAIRS = [
  { symbol: 'BTC/USD', price: 45000, change: 2.3, volume: 1245678 },
  { symbol: 'ETH/USD', price: 2800, change: 1.5, volume: 987654 },
  { symbol: 'SOL/USD', price: 105, change: 4.2, volume: 756432 },
  { symbol: 'BNB/USD', price: 520, change: -0.8, volume: 543210 },
  { symbol: 'ADA/USD', price: 0.45, change: -1.2, volume: 432109 },
  { symbol: 'XRP/USD', price: 0.55, change: 3.1, volume: 321098 },
  { symbol: 'DOT/USD', price: 6.3, change: 0.5, volume: 210987 },
  { symbol: 'DOGE/USD', price: 0.08, change: 5.7, volume: 198765 },
];

const TradingHeader: React.FC<TradingHeaderProps> = ({ 
  symbol, 
  price, 
  change, 
  volume,
  onSymbolChange 
}) => {
  const isPositive = change >= 0;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Check scroll possibility
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };
  
  // Initialize scroll check
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);
  
  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };
  
  const handlePairSelect = (pair: typeof AVAILABLE_PAIRS[0]) => {
    if (onSymbolChange) {
      onSymbolChange(pair.symbol);
    }
  };
  
  return (
    <div className="flex flex-col w-full border-b border-border bg-component-background">
      <div className="flex items-center justify-between w-full py-3 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">{symbol}</h1>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
            <div className={`flex items-center text-sm ${isPositive ? 'text-up' : 'text-down'}`}>
              {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(change).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-muted-foreground">24h Volume</span>
          <span className="font-medium">${volume.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="relative flex items-center bg-muted px-1 py-2">
        {canScrollLeft && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 z-10 h-full px-1 bg-muted hover:bg-muted/90"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none px-6" 
          onScroll={checkScroll}
        >
          {AVAILABLE_PAIRS.map((pair) => (
            <div 
              key={pair.symbol}
              onClick={() => handlePairSelect(pair)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer hover:bg-accent whitespace-nowrap ${
                pair.symbol === symbol ? 'bg-accent' : ''
              }`}
            >
              <span className="font-medium">{pair.symbol}</span>
              <span className={`text-xs ${pair.change >= 0 ? 'text-up' : 'text-down'}`}>
                {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
        
        {canScrollRight && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 z-10 h-full px-1 bg-muted hover:bg-muted/90"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TradingHeader;
