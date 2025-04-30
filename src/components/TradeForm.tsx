
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TradeFormProps {
  currentPrice: number;
  symbol?: string;
}

const TradeForm: React.FC<TradeFormProps> = ({ currentPrice, symbol = 'BTC/USD' }) => {
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>(currentPrice.toFixed(2));
  const [total, setTotal] = useState<string>('');
  
  // Update price when currentPrice changes
  useEffect(() => {
    setPrice(currentPrice.toFixed(2));
  }, [currentPrice]);
  
  // Get currency symbol from trading pair
  const getCurrencySymbol = (sym: string): string => {
    const parts = sym.split('/');
    return parts.length > 0 ? parts[0] : 'BTC';
  };
  
  const currency = getCurrencySymbol(symbol);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value && price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    } else {
      setTotal('');
    }
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    if (amount && value) {
      setTotal((parseFloat(amount) * parseFloat(value)).toFixed(2));
    } else {
      setTotal('');
    }
  };
  
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTotal(value);
    if (value && price && parseFloat(price) > 0) {
      setAmount((parseFloat(value) / parseFloat(price)).toFixed(8));
    } else {
      setAmount('');
    }
  };
  
  const handleBuy = () => {
    if (!amount || !price || !total) {
      toast("Please fill all fields", { 
        description: "Amount, price and total are required",
        icon: "⚠️"
      });
      return;
    }
    
    toast("Order placed", {
      description: `Buy ${amount} ${currency} at $${price}`,
      icon: "✅"
    });
    
    // Reset form
    setAmount('');
    setPrice(currentPrice.toFixed(2));
    setTotal('');
  };
  
  const handleSell = () => {
    if (!amount || !price || !total) {
      toast("Please fill all fields", { 
        description: "Amount, price and total are required",
        icon: "⚠️"
      });
      return;
    }
    
    toast("Order placed", {
      description: `Sell ${amount} ${currency} at $${price}`,
      icon: "✅"
    });
    
    // Reset form
    setAmount('');
    setPrice(currentPrice.toFixed(2));
    setTotal('');
  };
  
  return (
    <div className="trade-component h-full flex flex-col">
      <Tabs defaultValue="limit" className="w-full">
        <div className="trade-component-header">
          <TabsList className="bg-muted grid w-full grid-cols-3">
            <TabsTrigger value="limit">Limit</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="stop">Stop</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="limit" className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Price</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={price} 
              onChange={handlePriceChange} 
              className="bg-secondary/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Amount ({currency})</label>
            <Input 
              type="number" 
              placeholder="0.00000000" 
              value={amount} 
              onChange={handleAmountChange} 
              className="bg-secondary/50"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="col-span-1" onClick={() => {
              const newAmount = ((parseFloat(amount) || 0) + 0.1).toFixed(2);
              setAmount(newAmount);
              if (price) {
                setTotal((parseFloat(newAmount) * parseFloat(price)).toFixed(2));
              }
            }}>25%</Button>
            <Button variant="outline" size="sm" className="col-span-1" onClick={() => {
              const newAmount = ((parseFloat(amount) || 0) + 0.5).toFixed(2);
              setAmount(newAmount);
              if (price) {
                setTotal((parseFloat(newAmount) * parseFloat(price)).toFixed(2));
              }
            }}>50%</Button>
            <Button variant="outline" size="sm" className="col-span-1" onClick={() => {
              const newAmount = ((parseFloat(amount) || 0) + 0.75).toFixed(2);
              setAmount(newAmount);
              if (price) {
                setTotal((parseFloat(newAmount) * parseFloat(price)).toFixed(2));
              }
            }}>75%</Button>
            <Button variant="outline" size="sm" className="col-span-1" onClick={() => {
              const newAmount = ((parseFloat(amount) || 0) + 1).toFixed(2);
              setAmount(newAmount);
              if (price) {
                setTotal((parseFloat(newAmount) * parseFloat(price)).toFixed(2));
              }
            }}>100%</Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Total (USD)</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={total} 
              onChange={handleTotalChange} 
              className="bg-secondary/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="w-full bg-up hover:bg-up/90 text-white flex items-center gap-2"
              onClick={handleBuy}
            >
              <ArrowUp size={16} />
              Buy {currency}
            </Button>
            <Button 
              className="w-full bg-down hover:bg-down/90 text-white flex items-center gap-2"
              onClick={handleSell}
            >
              <ArrowDown size={16} />
              Sell {currency}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="px-4 py-8 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-sm">Market Orders Coming Soon</p>
        </TabsContent>
        
        <TabsContent value="stop" className="px-4 py-8 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-sm">Stop Orders Coming Soon</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeForm;
