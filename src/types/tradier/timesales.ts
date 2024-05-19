import * as ioType from 'io-ts';

export const tradierSeriesDataV = ioType.readonly(
    ioType.type({
        time: ioType.string,
        timestamp: ioType.number,
        price: ioType.number,
        open: ioType.number,
        high: ioType.number,
        low: ioType.number,
        close: ioType.number,
        volume: ioType.number,
        vwap: ioType.number
    })
);
export type TradierSeriesData = ioType.TypeOf<typeof tradierSeriesDataV>;

export const tradierSeriesV = ioType.readonly(
    ioType.type({
        series: ioType.union([
            ioType.type({
                data: ioType.union([
                    ioType.readonly(tradierSeriesDataV),
                    ioType.readonlyArray(tradierSeriesDataV)
                ])
            }),
            ioType.null
        ])
    })
);
export type TradierSeries = ioType.TypeOf<typeof tradierSeriesV>;
