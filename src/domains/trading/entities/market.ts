import { z } from 'zod';

export const MarketSchema = z.object({
  symbol: z.string(),
  baseAsset: z.string(),
  quoteAsset: z.string(),
  pricePrecision: z.number(),
  quantityPrecision: z.number(),
  status: z.enum(['TRADING', 'HALTED', 'CLOSED']),
});

export type Market = z.infer<typeof MarketSchema>;

export class MarketEntity {
  constructor(
    public readonly symbol: string,
    public readonly baseAsset: string,
    public readonly quoteAsset: string,
    public readonly pricePrecision: number,
    public readonly quantityPrecision: number,
    public readonly status: 'TRADING' | 'HALTED' | 'CLOSED'
  ) {}

  static fromObject(obj: Market): MarketEntity {
    return new MarketEntity(
      obj.symbol,
      obj.baseAsset,
      obj.quoteAsset,
      obj.pricePrecision,
      obj.quantityPrecision,
      obj.status
    );
  }
}