import * as ioType from 'io-ts';

export const tradierHistoryDayV = ioType.readonly(
	ioType.type({
		date: ioType.string,
		open: ioType.number,
		high: ioType.number,
		low: ioType.number,
		close: ioType.number
	})
);
export type TradierHistoryDay = ioType.TypeOf<typeof tradierHistoryDayV>;

export const tradierHistoryV = ioType.readonly(
	ioType.type({
		history: ioType.readonly(
			ioType.type({
				day: ioType.readonlyArray(tradierHistoryDayV)
			})
		)
	})
);
export type TradierHistory = ioType.TypeOf<typeof tradierHistoryV>;
