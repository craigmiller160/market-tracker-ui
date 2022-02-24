import * as ioType from 'io-ts';
import * as TypeValidation from '@craigmiller160/ts-functions/es/TypeValidation';

export const tradierHistoryDayV = ioType.readonly(
	ioType.type({
		date: ioType.string,
		open: ioType.union([ioType.number, TypeValidation.typeNaN]),
		high: ioType.union([ioType.number, TypeValidation.typeNaN]),
		low: ioType.union([ioType.number, TypeValidation.typeNaN]),
		close: ioType.union([ioType.number, TypeValidation.typeNaN])
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
