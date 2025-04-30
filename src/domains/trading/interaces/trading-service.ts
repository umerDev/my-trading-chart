import { Trade, Order, Market } from '../entities';

export interface ITradingService {
  getMarket(symbol: string): Promise<Market>;
  getTrades(symbol: string, limit?: number): Promise<Trade[]>;
  getOrderBook(symbol: string, limit?: number): Promise<Order[]>;
  placeOrder(order: Omit<Order, 'id' | 'status' | 'timestamp'>): Promise<Order>;
  cancelOrder(id: string): Promise<void>;
}