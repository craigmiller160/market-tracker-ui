import * as ioType from 'io-ts';

export const tradierQuoteV = ioType.readonly(
	ioType.type({
		symbol: ioType.string,
		description: ioType.string,
		open: ioType.number,
		high: ioType.number,
		low: ioType.number,
		bid: ioType.number,
		ask: ioType.number,
		close: ioType.union([ioType.number, ioType.null]),
		last: ioType.number
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
