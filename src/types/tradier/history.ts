import * as ioType from 'io-ts';

export const tradierHistoryDayV = ioType.readonly(
	ioType.type({
		date: ioType.string,
		open: ioType.union([ioType.number, ioType.string]),
		high: ioType.union([ioType.number, ioType.string]),
		low: ioType.union([ioType.number, ioType.string]),
		close: ioType.union([ioType.number, ioType.string])
	})
);
export type TradierHistoryDay = ioType.TypeOf<typeof tradierHistoryDayV>;

export const tradierHistoryV = ioType.readonly(
	ioType.type({
		history: ioType.union([
			ioType.readonly(
				ioType.type({
					day: ioType.readonlyArray(tradierHistoryDayV)
				})
			),
			ioType.null
		])
	})
);
export type TradierHistory = ioType.TypeOf<typeof tradierHistoryV>;
