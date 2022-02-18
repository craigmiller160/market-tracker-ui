import { MarketStatus } from '../MarketStatus';
import { match } from 'ts-pattern';
import * as ioType from 'io-ts';

export type TradierCalendarStatus = 'open' | 'closed';
export const calendarStatusV = ioType.keyof({
	open: null,
	closed: null
});
export const tradierCalendarDayV = ioType.readonly(
	ioType.type({
		date: ioType.string,
		status: calendarStatusV
	})
);
export type TradierCalendarDay = ioType.TypeOf<typeof tradierCalendarDayV>;

export const tradierCalendarV = ioType.readonly(
	ioType.type({
		calendar: ioType.readonly(
			ioType.type({
				month: ioType.number,
				year: ioType.number,
				days: ioType.readonly(
					ioType.type({
						day: ioType.readonlyArray(tradierCalendarDayV)
					})
				)
			})
		)
	})
);
export type TradierCalendar = ioType.TypeOf<typeof tradierCalendarV>;

export const toMarketStatus = (status: TradierCalendarStatus): MarketStatus =>
	match(status)
		.with('open', () => MarketStatus.OPEN)
		.with('closed', () => MarketStatus.CLOSED)
		.run();
