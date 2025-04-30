
import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Order | null>(null);
  
  useEffect(() => {
    // Generate initial order book when symbol changes
    const basePrice = getBasePriceForSymbol(symbol);
    generateOrderBook(basePrice);
    
    // Update order book every few seconds
    const intervalId = setInterval(() => {
      updateOrderBook();
    }, 3000);
    
    return () => clearInterval(intervalId);
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
  
  const generateOrderBook = (basePrice: number) => {
    const buys: Order[] = [];
    const sells: Order[] = [];
    
    // Generate buy orders (lower than base price)
    for (let i = 0; i < 15; i++) {
      const price = basePrice - (i * 10) - Math.random() * 10;
      const quantity = 0.1 + Math.random() * 2;
      buys.push({
        price,
        quantity,
        total: price * quantity
      });
    }
    
    // Generate sell orders (higher than base price)
    for (let i = 0; i < 15; i++) {
      const price = basePrice + (i * 10) + Math.random() * 10;
      const quantity = 0.1 + Math.random() * 2;
      sells.push({
        price,
        quantity,
        total: price * quantity
      });
    }
    
    buys.sort((a, b) => b.price - a.price);
    sells.sort((a, b) => a.price - b.price);
    
    setBuyOrders(buys);
    setSellOrders(sells);
  };
  
  const updateOrderBook = () => {
    // Randomly update some orders
    setBuyOrders(prev => {
      const newBuys = [...prev];
      const idx = Math.floor(Math.random() * newBuys.length);
      const order = { ...newBuys[idx] };
      const changeQty = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.5;
      order.quantity = Math.max(0.01, order.quantity + changeQty);
      order.total = order.price * order.quantity;
      newBuys[idx] = order;
      setLastUpdated(order);
      return newBuys;
    });
    
    setSellOrders(prev => {
      const newSells = [...prev];
      const idx = Math.floor(Math.random() * newSells.length);
      const order = { ...newSells[idx] };
      const changeQty = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.5;
      order.quantity = Math.max(0.01, order.quantity + changeQty);
      order.total = order.price * order.quantity;
      newSells[idx] = order;
      return newSells;
    });
  };
  
  // Extract currency symbol for displaying in amounts
  const getCurrencySymbol = (sym: string): string => {
    const parts = sym.split('/');
    return parts.length > 0 ? parts[0] : 'BTC';
  };
  
  const currency = getCurrencySymbol(symbol);
  
  return (
    <div className="trade-component h-full flex flex-col">
      <div className="trade-component-header">
        <div className="flex items-center gap-2">
          <Database size={16} />
          <span>Order Book - {symbol}</span>
        </div>
        <button 
          className="text-xs hover:text-primary"
          onClick={() => toast("Order book refreshed")}
        >
          Refresh
        </button>
      </div>
      
      <div className="flex text-xs text-muted-foreground px-2 py-1 border-b border-border">
        <div className="w-1/3 text-left">Price (USD)</div>
        <div className="w-1/3 text-right">Amount ({currency})</div>
        <div className="w-1/3 text-right">Total (USD)</div>
      </div>
      
      {/* Sell orders */}
      <div className="overflow-y-auto h-1/2">
        {sellOrders.map((order, index) => (
          <div 
            key={`sell-${index}`} 
            className={`flex text-xs py-0.5 px-2 text-down ${lastUpdated === order ? 'bg-down/10 animate-pulse' : ''}`}
          >
            <div className="w-1/3 text-left">{order.price.toFixed(2)}</div>
            <div className="w-1/3 text-right">{order.quantity.toFixed(4)}</div>
            <div className="w-1/3 text-right">{order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      {/* Current price indicator */}
      <div className="flex justify-between items-center py-1 px-2 bg-muted/20 border-y border-border">
        <span className="text-sm font-medium">
          {buyOrders.length > 0 ? buyOrders[0].price.toFixed(2) : '0.00'}
        </span>
        <span className="text-xs text-muted-foreground">Last Price</span>
      </div>
      
      {/* Buy orders */}
      <div className="overflow-y-auto h-1/2">
        {buyOrders.map((order, index) => (
          <div 
            key={`buy-${index}`} 
            className={`flex text-xs py-0.5 px-2 text-up ${lastUpdated === order ? 'bg-up/10 animate-pulse' : ''}`}
          >
            <div className="w-1/3 text-left">{order.price.toFixed(2)}</div>
            <div className="w-1/3 text-right">{order.quantity.toFixed(4)}</div>
            <div className="w-1/3 text-right">{order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
