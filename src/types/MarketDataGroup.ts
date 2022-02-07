import { MarketStatus } from './MarketStatus';
import { MarketData } from './MarketData';

export interface MarketDataGroup {
	readonly marketStatus: MarketStatus;
	readonly data: ReadonlyArray<MarketData>;
}
