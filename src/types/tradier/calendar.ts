// TODO fix readonly
import { MarketStatus } from '../MarketStatus';
import { match } from 'ts-pattern';
import * as ioType from 'io-ts';

export type TradierCalendarStatus = 'open' | 'closed';
export const calendarStatusV = ioType.keyof({
	open: null,
	closed: null
});
export const tradierCalendarDayV = ioType.type({
	date: ioType.readonly(ioType.string),
	status: ioType.readonly(calendarStatusV)
});
export type TradierCalendarDay = ioType.TypeOf<typeof tradierCalendarDayV>;

export const tradierCalendarV = ioType.type({
	calendar: ioType.readonly(
		ioType.type({
			month: ioType.readonly(ioType.number),
			year: ioType.readonly(ioType.number),
			days: ioType.readonly(
				ioType.type({
					day: ioType.readonlyArray(tradierCalendarDayV)
				})
			)
		})
	)
});
export type TradierCalendar = ioType.TypeOf<typeof tradierCalendarV>;

export const toMarketStatus = (status: TradierCalendarStatus): MarketStatus =>
	match(status)
		.with('open', () => MarketStatus.OPEN)
		.with('closed', () => MarketStatus.CLOSED)
		.run();
