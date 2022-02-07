import { MarketStatus } from './MarketStatus';
import { MarketData } from './MarketData';
import { MarketTime } from './MarketTime';

export interface MarketDataGroup {
	readonly time: MarketTime;
	readonly marketStatus: MarketStatus;
	readonly data: ReadonlyArray<MarketData>;
}
