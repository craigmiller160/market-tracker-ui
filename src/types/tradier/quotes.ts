import * as ioType from 'io-ts';

export const tradierQuoteV = ioType.readonly(
	ioType.type({
		symbol: ioType.string,
		description: ioType.string,
		open: ioType.union([ioType.number, ioType.null]),
		high: ioType.union([ioType.number, ioType.null]),
		low: ioType.union([ioType.number, ioType.null]),
		bid: ioType.union([ioType.number, ioType.null]),
		ask: ioType.union([ioType.number, ioType.null]),
		close: ioType.union([ioType.number, ioType.null]),
		last: ioType.union([ioType.number, ioType.null]),
		prevclose: ioType.union([ioType.number, ioType.number])
	})
);
export type TradierQuote = ioType.TypeOf<typeof tradierQuoteV>;

export const tradierQuotesV = ioType.readonly(
	ioType.type({
		quotes: ioType.readonly(
			ioType.type({
				quote: ioType.union([
					tradierQuoteV,
					ioType.readonlyArray(tradierQuoteV)
				])
			})
		)
	})
);
export type TradierQuotes = ioType.TypeOf<typeof tradierQuotesV>;
