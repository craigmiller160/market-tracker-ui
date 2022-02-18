import * as ioType from 'io-ts';

export const tradierHistoryDayV = ioType.type({
	date: ioType.readonly(ioType.string),
	open: ioType.readonly(ioType.number),
	high: ioType.readonly(ioType.number),
	low: ioType.readonly(ioType.number),
	close: ioType.readonly(ioType.number)
});
export type TradierHistoryDay = ioType.TypeOf<typeof tradierHistoryDayV>;

export const tradierHistoryV = ioType.type({
	history: ioType.readonly(
		ioType.type({
			day: ioType.readonlyArray(tradierHistoryDayV)
		})
	)
});
export type TradierHistory = ioType.TypeOf<typeof tradierHistoryV>;
