// TODO fix readonly
import * as ioType from 'io-ts';

export const tradierSeriesDataV = ioType.type({
	time: ioType.readonly(ioType.string),
	timestamp: ioType.readonly(ioType.number),
	price: ioType.readonly(ioType.number),
	open: ioType.readonly(ioType.number),
	high: ioType.readonly(ioType.number),
	low: ioType.readonly(ioType.number),
	close: ioType.readonly(ioType.number),
	volume: ioType.readonly(ioType.number),
	vwap: ioType.readonly(ioType.number)
});
export type TradierSeriesData = ioType.TypeOf<typeof tradierSeriesDataV>;

export const tradierSeriesV = ioType.type({
	series: ioType.readonly(
		ioType.type({
			data: ioType.readonlyArray(tradierSeriesDataV)
		})
	)
});
export type TradierSeries = ioType.TypeOf<typeof tradierSeriesV>;
