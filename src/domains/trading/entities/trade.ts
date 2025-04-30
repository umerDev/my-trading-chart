import { z } from 'zod';

export const TradeSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  price: z.number(),
  quantity: z.number(),
  side: z.enum(['BUY', 'SELL']),
  timestamp: z.number(),
  type: z.enum(['MARKET', 'LIMIT']),
});

export type Trade = z.infer<typeof TradeSchema>;

export class TradeEntity {
  constructor(
    public readonly id: string,
    public readonly symbol: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly side: 'BUY' | 'SELL',
    public readonly timestamp: number,
    public readonly type: 'MARKET' | 'LIMIT'
  ) {}

  static fromObject(obj: Trade): TradeEntity {
    return new TradeEntity(
      obj.id,
      obj.symbol,
      obj.price,
      obj.quantity,
      obj.side,
      obj.timestamp,
      obj.type
    );
  }
}