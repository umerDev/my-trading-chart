
import React, { useState, useEffect } from 'react';
import GridLayout from '@/components/GridLayout';
import PriceChart from '@/components/PriceChart';
import OrderBook from '@/components/OrderBook';
import TradeForm from '@/components/TradeForm';
import MarketTrades from '@/components/MarketTrades';
import TradingHeader from '@/components/TradingHeader';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

// Sample data for price charts
const generateChartData = (basePrice: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const open = basePrice + Math.random() * 2000 - 1000;
    const close = open + Math.random() * 400 - 200;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    
    data.push({
      time: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close
    });
  }
  
  return data;
};

// Currency pairs with their corresponding base prices
const currencyBasePrices = {
  'BTC/USD': 45000,
  'ETH/USD': 2800,
  'SOL/USD': 105,
  'BNB/USD': 520,
  'ADA/USD': 0.45,
  'XRP/USD': 0.55,
  'DOT/USD': 6.3,
  'DOGE/USD': 0.08,
};

const Index = () => {
  const [symbol, setSymbol] = useState('BTC/USD');
  const [chartData, setChartData] = useState(generateChartData(currencyBasePrices['BTC/USD']));
  const [currentPrice, setCurrentPrice] = useState(currencyBasePrices['BTC/USD']);
  const [priceChange, setPriceChange] = useState(0);
  const [volume, setVolume] = useState(1245678);
  
  // Define initial layout to be able to reset to it
  const initialLayout = [
    {
      id: 'chart',
      x: 0,
      y: 0,
      w: 8,
      h: 8,
      component: <PriceChart data={chartData} symbol={symbol} />
    },
    {
      id: 'orderbook',
      x: 8,
      y: 0,
      w: 4,
      h: 8,
      component: <OrderBook symbol={symbol} />
    },
    {
      id: 'tradeform',
      x: 0,
      y: 8,
      w: 4,
      h: 6,
      component: <TradeForm currentPrice={currentPrice} symbol={symbol} />
    },
    {
      id: 'trades',
      x: 4,
      y: 8,
      w: 8,
      h: 6,
      component: <MarketTrades symbol={symbol} />
    }
  ];
  
  const [layoutItems, setLayoutItems] = useState(initialLayout);
  
  // Reset layout function
  const resetLayout = () => {
    // Update layout items with current data but original positions
    setLayoutItems([
      {
        ...initialLayout[0],
        component: <PriceChart data={chartData} symbol={symbol} />
      },
      {
        ...initialLayout[1],
        component: <OrderBook symbol={symbol} />
      },
      {
        ...initialLayout[2],
        component: <TradeForm currentPrice={currentPrice} symbol={symbol} />
      },
      {
        ...initialLayout[3],
        component: <MarketTrades symbol={symbol} />
      }
    ]);
    
    toast("Layout reset", {
      description: "All components have been reset to their original positions"
    });
  };
  
  useEffect(() => {
    if (chartData.length > 0) {
      const lastCandle = chartData[chartData.length - 1];
      setCurrentPrice(lastCandle.close);
      
      // Calculate 24h change percentage
      const yesterday = chartData[chartData.length - 2] || chartData[0];
      const changePercent = ((lastCandle.close - yesterday.close) / yesterday.close) * 100;
      setPriceChange(changePercent);
    }
    
    // Display welcome toast
    toast("Welcome to Trading App", {
      description: "Drag and drop components to customize your layout",
      duration: 5000
    });
    
    // Update price periodically
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const newPrice = prev * (1 + (Math.random() * 0.002 - 0.001));
        const newChangePercent = priceChange + (Math.random() * 0.2 - 0.1);
        setPriceChange(newChangePercent);
        return newPrice;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [chartData]);
  
  // Update layout items when symbol, chartData, or currentPrice changes
  useEffect(() => {
    setLayoutItems(prevItems => prevItems.map(item => {
      if (item.id === 'chart') {
        return { ...item, component: <PriceChart data={chartData} symbol={symbol} /> };
      } else if (item.id === 'orderbook') {
        return { ...item, component: <OrderBook symbol={symbol} /> };
      } else if (item.id === 'tradeform') {
        return { ...item, component: <TradeForm currentPrice={currentPrice} symbol={symbol} /> };
      } else if (item.id === 'trades') {
        return { ...item, component: <MarketTrades symbol={symbol} /> };
      }
      return item;
    }));
  }, [symbol, chartData, currentPrice]);

  // Handle currency change
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    
    // Generate new chart data based on the selected currency
    const basePrice = currencyBasePrices[newSymbol as keyof typeof currencyBasePrices] || 1000;
    const newData = generateChartData(basePrice);
    setChartData(newData);
    
    // Set current price based on the latest candle
    if (newData.length > 0) {
      const lastCandle = newData[newData.length - 1];
      setCurrentPrice(lastCandle.close);
      
      // Calculate new change percentage
      const yesterday = newData[newData.length - 2] || newData[0];
      const changePercent = ((lastCandle.close - yesterday.close) / yesterday.close) * 100;
      setPriceChange(changePercent);
    } else {
      setCurrentPrice(basePrice);
      setPriceChange(0);
    }
    
    // Set new volume (random for demo)
    setVolume(Math.floor(Math.random() * 2000000) + 500000);
    
    toast(`Switched to ${newSymbol}`, {
      description: "Chart and orderbook updated with new data"
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-app-background">
      <TradingHeader 
        symbol={symbol} 
        price={currentPrice} 
        change={priceChange} 
        volume={volume}
        onSymbolChange={handleSymbolChange}
      />
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-medium">Trading Dashboard</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetLayout}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset Layout
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <GridLayout items={layoutItems} />
      </div>
    </div>
  );
};

export default Index;
