import { type TryT } from '@craigmiller160/ts-functions/types';
import { marketTrackerApiFpTs, getResponseData } from './AjaxApi';
import { flow, pipe } from 'fp-ts/function';
import * as TaskEither from 'fp-ts/TaskEither';
import qs from 'qs';
import {
    type TradierHistory,
    type TradierHistoryDay,
    tradierHistoryV
} from '../types/tradier/history';
import {
    type TradierQuote,
    type TradierQuotes,
    tradierQuotesV
} from '../types/tradier/quotes';
import { match, P } from 'ts-pattern';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';
import { type Quote } from '../types/quote';
import { type HistoryRecord } from '../types/history';
import {
    formatHistoryDate,
    getFiveYearHistoryStartDate,
    getOneMonthHistoryStartDate,
    getOneWeekHistoryStartDate,
    getOneYearHistoryStartDate,
    getThreeMonthHistoryStartDate,
    getTodayEndString,
    getTodayStartString
} from '../utils/timeUtils';
import {
    type TradierSeries,
    type TradierSeriesData,
    tradierSeriesV
} from '../types/tradier/timesales';
import * as Time from '@craigmiller160/ts-functions/Time';
import { MarketStatus } from '../types/MarketStatus';
import {
    toMarketStatus,
    type TradierCalendar,
    type TradierCalendarStatus,
    tradierCalendarV
} from '../types/tradier/calendar';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';
import * as Either from 'fp-ts/Either';
import { InvestmentNotFoundError } from '../error/InvestmentNotFoundError';
import { taskEitherToPromise } from '../function/TaskEitherToPromise';

const formatCalendarYear = Time.format('yyyy');
const formatCalendarMonth = Time.format('MM');
const formatCalendarDate = Time.format('yyyy-MM-dd');
const decodeQuotes = TypeValidation.decode(tradierQuotesV);
const decodeTimesales = TypeValidation.decode(tradierSeriesV);
const decodeHistory = TypeValidation.decode(tradierHistoryV);
const decodeCalendar = TypeValidation.decode(tradierCalendarV);
const getMillisFromDateTime = (d: string): number =>
    Time.parse('yyyy-MM-dd HH:mm:ss')(d).getTime();

export interface HistoryQuery {
    readonly symbol: string;
    readonly interval: string;
    readonly start: string;
    readonly end: string;
}

const formatTradierQuotes = (
    quotes: TradierQuotes
): TryT<ReadonlyArray<Quote>> => {
    const tradierQuotesEither = match(quotes.quotes)
        .with({ unmatched_symbols: P.not(undefined) }, (_) =>
            Either.left(
                new InvestmentNotFoundError(
                    _.unmatched_symbols.symbol.toString()
                )
            )
        )
        .with({ quote: P.instanceOf(Array) }, () =>
            Either.right(quotes.quotes.quote as ReadonlyArray<TradierQuote>)
        )
        .otherwise(() => Either.right([quotes.quotes.quote as TradierQuote]));
    return pipe(
        tradierQuotesEither,
        Either.map(
            RArray.map(
                (_: TradierQuote): Quote => ({
                    symbol: _.symbol,
                    name: _.description,
                    price: _.last ?? 0,
                    previousClose: _.prevclose ?? 0
                })
            )
        )
    );
};

const createTradierHistoryRecord = (
    date: string,
    time: string,
    price: number
): HistoryRecord => ({
    date,
    time,
    unixTimestampMillis: getMillisFromDateTime(`${date} ${time}`),
    price
});

const tradierHistoryToHistoryRecord = (
    tHistory: TradierHistoryDay
): ReadonlyArray<HistoryRecord> => {
    const open = parseInt(`${tHistory.open}`);
    const close = parseInt(`${tHistory.close}`);
    return match({
        date: tHistory.date,
        open,
        close
    })
        .with({ open: P.not(NaN), close: NaN }, () => [
            createTradierHistoryRecord(tHistory.date, '00:00:00', open)
        ])
        .with({ open: NaN, close: P.not(NaN) }, () => [
            createTradierHistoryRecord(tHistory.date, '23:59:59', close)
        ])
        .with({ open: NaN, close: NaN }, () => [])
        .otherwise(() => [
            createTradierHistoryRecord(tHistory.date, '00:00:00', open),
            createTradierHistoryRecord(tHistory.date, '23:59:59', close)
        ]);
};

const formatTradierHistory = (
    history: TradierHistory
): ReadonlyArray<HistoryRecord> =>
    pipe(
        Option.fromNullable(history.history),
        Option.map((_) => _.day),
        Option.getOrElse((): ReadonlyArray<TradierHistoryDay> => []),
        RArray.chain(tradierHistoryToHistoryRecord)
    );

const parseTimesaleTimestamp = Time.parse("yyyy-MM-dd'T'HH:mm:ss");

const getTimesaleDate: (timestamp: string) => string = flow(
    parseTimesaleTimestamp,
    Time.format('yyyy-MM-dd')
);

const getTimesaleTime: (timestamp: string) => string = flow(
    parseTimesaleTimestamp,
    Time.format('HH:mm:ss')
);

const ensureSeriesDataArray = (
    data: TradierSeriesData | ReadonlyArray<TradierSeriesData>
): ReadonlyArray<TradierSeriesData> =>
    match(data)
        .with(
            P.instanceOf(Array),
            () => data as ReadonlyArray<TradierSeriesData>
        )
        .otherwise(() => [data] as ReadonlyArray<TradierSeriesData>);

const formatTimesales = (
    timesales: TradierSeries
): ReadonlyArray<HistoryRecord> =>
    pipe(
        Option.fromNullable(timesales.series),
        Option.map((_) => _.data),
        Option.map(ensureSeriesDataArray),
        Option.map(
            RArray.map(
                (_: TradierSeriesData): HistoryRecord => ({
                    date: getTimesaleDate(_.time),
                    time: getTimesaleTime(_.time),
                    unixTimestampMillis: _.timestamp * 1000,
                    price: _.price
                })
            )
        ),
        Option.getOrElse((): ReadonlyArray<HistoryRecord> => [])
    );

export const getTimesales = (
    symbol: string,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const start = getTodayStartString();
    const end = getTodayEndString();
    return pipe(
        marketTrackerApiFpTs.get<TradierSeries>({
            uri: `/tradier/markets/timesales?symbol=${symbol}&start=${start}&end=${end}&interval=1min`,
            config: {
                signal
            }
        }),
        TaskEither.map(getResponseData),
        TaskEither.chainEitherK(decodeTimesales),
        TaskEither.map(formatTimesales),
        taskEitherToPromise
    );
};

export const getQuotes = (
    symbols: ReadonlyArray<string>,
    signal?: AbortSignal
): Promise<ReadonlyArray<Quote>> =>
    pipe(
        marketTrackerApiFpTs.get<TradierQuotes>({
            uri: `/tradier/markets/quotes?symbols=${symbols.join(',')}`,
            config: {
                signal
            }
        }),
        TaskEither.map(getResponseData),
        TaskEither.chainEitherK(decodeQuotes),
        TaskEither.chainEitherK(formatTradierQuotes),
        taskEitherToPromise
    );

const getHistoryQuote = (
    historyQuery: HistoryQuery,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const queryString = qs.stringify(historyQuery);
    return pipe(
        marketTrackerApiFpTs.get<TradierHistory>({
            uri: `/tradier/markets/history?${queryString}`,
            config: {
                signal
            }
        }),
        TaskEither.map(getResponseData),
        TaskEither.chainEitherK(decodeHistory),
        TaskEither.map(formatTradierHistory),
        taskEitherToPromise
    );
};

export const getOneWeekHistory = (
    symbol: string,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const today = new Date();
    return getHistoryQuote(
        {
            symbol,
            start: getOneWeekHistoryStartDate(),
            end: formatHistoryDate(today),
            interval: 'daily'
        },
        signal
    );
};

export const getOneMonthHistory = (
    symbol: string,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const today = new Date();
    return getHistoryQuote(
        {
            symbol,
            start: getOneMonthHistoryStartDate(),
            end: formatHistoryDate(today),
            interval: 'daily'
        },
        signal
    );
};

export const getThreeMonthHistory = (
    symbol: string,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const today = new Date();
    return getHistoryQuote(
        {
            symbol,
            start: getThreeMonthHistoryStartDate(),
            end: formatHistoryDate(today),
            interval: 'daily'
        },
        signal
    );
};

export const getOneYearHistory = (
    symbol: string,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const today = new Date();
    return getHistoryQuote(
        {
            symbol,
            start: getOneYearHistoryStartDate(),
            end: formatHistoryDate(today),
            interval: 'weekly'
        },
        signal
    );
};

export const getFiveYearHistory = (
    symbol: string,
    signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
    const today = new Date();
    return getHistoryQuote(
        {
            symbol,
            start: getFiveYearHistoryStartDate(),
            end: formatHistoryDate(today),
            interval: 'monthly'
        },
        signal
    );
};

export const getMarketStatus = (
    signal?: AbortSignal
): Promise<MarketStatus> => {
    const today = new Date();
    const year = formatCalendarYear(today);
    const month = formatCalendarMonth(today);
    const calendarDate = formatCalendarDate(today);
    return pipe(
        marketTrackerApiFpTs.get<TradierCalendar>({
            uri: `/tradier/markets/calendar?year=${year}&month=${month}`,
            config: {
                signal
            }
        }),
        TaskEither.map(getResponseData),
        TaskEither.chainEitherK(decodeCalendar),
        TaskEither.map((_) => _.calendar.days.day),
        TaskEither.map(
            flow(
                RArray.findFirst((_) => _.date === calendarDate),
                Option.map((_) => _.status),
                Option.getOrElse((): TradierCalendarStatus => {
                    console.error('Could not find matching calendar date');
                    return 'closed';
                })
            )
        ),
        TaskEither.map(toMarketStatus),
        taskEitherToPromise
    );
};
