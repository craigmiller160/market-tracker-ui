// TODO add typechecking

import { MarketStatus } from '../MarketStatus';
import { match } from 'ts-pattern';

export type TradierCalendarStatus = 'open' | 'closed';

interface TradierCalendarDay {
	readonly date: string;
	readonly status: TradierCalendarStatus;
}

export interface TradierCalendar {
	readonly calendar: {
		readonly month: number;
		readonly year: number;
		readonly days: {
			readonly day: ReadonlyArray<TradierCalendarDay>;
		};
	};
}

export const toMarketStatus = (status: TradierCalendarStatus): MarketStatus =>
	match(status)
		.with('open', () => MarketStatus.OPEN)
		.with('closed', () => MarketStatus.CLOSED)
		.run();
