import { MarketStatus } from './MarketStatus';
import { MarketData } from './MarketData';
import { MarketTime } from './MarketTime';
import { InvestmentType } from '../data/InvestmentInfo';

// TODO delete if unused
export interface MarketDataGroup {
	readonly time: MarketTime;
	readonly marketStatus: MarketStatus;
	readonly data: ReadonlyArray<MarketData>;
	readonly type: InvestmentType;
}
