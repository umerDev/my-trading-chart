import { z } from 'zod';

export const OrderSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  price: z.number(),
  quantity: z.number(),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['LIMIT', 'MARKET']),
  status: z.enum(['PENDING', 'FILLED', 'CANCELED']),
  timestamp: z.number(),
});

export type Order = z.infer<typeof OrderSchema>;

export class OrderEntity {
  constructor(
    public readonly id: string,
    public readonly symbol: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly side: 'BUY' | 'SELL',
    public readonly type: 'LIMIT' | 'MARKET',
    public readonly status: 'PENDING' | 'FILLED' | 'CANCELED',
    public readonly timestamp: number
  ) {}

  static fromObject(obj: Order): OrderEntity {
    return new OrderEntity(
      obj.id,
      obj.symbol,
      obj.price,
      obj.quantity,
      obj.side,
      obj.type,
      obj.status,
      obj.timestamp
    );
  }
}