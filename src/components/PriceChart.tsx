
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { toast } from 'sonner';
import { ChartLine } from 'lucide-react';

interface PriceChartProps {
  data: { time: string, open: number, high: number, low: number, close: number }[];
  symbol: string;
}

type TimeframeOption = {
  label: string;
  value: string;
}

const timeframes: TimeframeOption[] = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '2h', value: '2h' },
  { label: '4h', value: '4h' },
  { label: '12h', value: '12h' },
  { label: '1D', value: '1d' },
  { label: '3D', value: '3d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
];

const PriceChart: React.FC<PriceChartProps> = ({ data, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  const headerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current!.clientWidth });
        }
      };

      // Clean up previous chart if it exists
      if (chartRef.current) {
        chartRef.current.remove();
      }

      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#848E9C',
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const candleSeries = chartRef.current.addCandlestickSeries({
        upColor: '#0ECB81',
        downColor: '#F6465D',
        borderVisible: false,
        wickUpColor: '#0ECB81',
        wickDownColor: '#F6465D',
      });

      candleSeriesRef.current = candleSeries;
      candleSeries.setData(data);

      window.addEventListener('resize', handleResize);

      // Simulating live data updates
      const intervalId = setInterval(() => {
        if (data.length > 0) {
          try {
            const lastCandle = { ...data[data.length - 1] };
            // Create a safe date for updates (avoid issues with invalid dates)
            const now = new Date();
            
            // Use current date string since the chart uses date strings
            const timeStr = now.toISOString().split('T')[0];
            
            const newPrice = lastCandle.close * (1 + (Math.random() * 0.01 - 0.005));
            
            const newCandle = {
              time: timeStr,
              open: lastCandle.close,
              high: Math.max(lastCandle.close, newPrice),
              low: Math.min(lastCandle.close, newPrice),
              close: newPrice
            };
            
            candleSeries.update(newCandle);
            data.push(newCandle);
          } catch (error) {
            console.error("Error updating chart:", error);
          }
        }
      }, 5000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(intervalId);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  }, [data, symbol]); // Recreate the chart when data or symbol changes

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    toast("Timeframe changed!", { description: `Chart timeframe updated to ${timeframe}` });
  };
  
  // This makes the header of the chart non-draggable
  const preventDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="trade-component h-full flex flex-col">
      <div 
        ref={headerRef} 
        className="trade-component-header"
        onMouseDown={preventDragStart}
      >
        <div className="flex items-center gap-2">
          <ChartLine size={16} />
          <span>Price Chart - {symbol}</span>
        </div>
        <div 
          className="flex items-center gap-1 overflow-x-auto scrollbar-none pr-2" 
          style={{ touchAction: 'none' }}
        >
          {timeframes.map(timeframe => (
            <button
              key={timeframe.value}
              className={`text-xs px-2 py-1 rounded ${
                selectedTimeframe === timeframe.value 
                  ? 'bg-accent text-white' 
                  : 'bg-muted hover:bg-accent/10'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleTimeframeChange(timeframe.value);
              }}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-container flex-1" />
    </div>
  );
};

export default PriceChart;
