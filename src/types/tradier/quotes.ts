// TODO fix readonly
import * as ioType from 'io-ts';

export const tradierQuoteV = ioType.type({
	symbol: ioType.readonly(ioType.string),
	description: ioType.readonly(ioType.string),
	open: ioType.readonly(ioType.number),
	high: ioType.readonly(ioType.number),
	low: ioType.readonly(ioType.number),
	bid: ioType.readonly(ioType.number),
	ask: ioType.readonly(ioType.number),
	close: ioType.union([ioType.number, ioType.null]),
	last: ioType.readonly(ioType.number)
});
export type TradierQuote = ioType.TypeOf<typeof tradierQuoteV>;

export const tradierQuotesV = ioType.type({
	quotes: ioType.readonly(
		ioType.type({
			quote: ioType.union([
				tradierQuoteV,
				ioType.readonlyArray(tradierQuoteV)
			])
		})
	)
});
export type TradierQuotes = ioType.TypeOf<typeof tradierQuotesV>;
