import { MarketTime } from '../types/MarketTime';
import {
    type OptionT,
    type PredicateT,
    type TryT
} from '@craigmiller160/ts-functions/types';
import { match, P } from 'ts-pattern';
import { type HistoryRecord } from '../types/history';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';
import { type Quote } from '../types/quote';
import * as Time from '@craigmiller160/ts-functions/Time';
import * as Either from 'fp-ts/Either';
import { isStock } from '../types/data/InvestmentType';
import { type InvestmentInfo } from '../types/data/InvestmentInfo';
import { type InvestmentData } from '../types/data/InvestmentData';

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const parseDateTime = Time.parse(DATE_TIME_FORMAT);
const formatTime = Time.format('HH:mm:ss');
const subtractOneHour = Time.subHours(1);
const formatDate = Time.format('yyyy-MM-dd');

const isLaterThanNow: PredicateT<OptionT<HistoryRecord>> = (mostRecentRecord) =>
    Option.fold(
        () => false,
        (_: HistoryRecord) => _.unixTimestampMillis > new Date().getTime()
    )(mostRecentRecord);

const getMostRecentHistoryRecord = (
    history: ReadonlyArray<HistoryRecord>
): OptionT<HistoryRecord> => RArray.last(history);

const getFirstHistoryRecordDate = (
    history: ReadonlyArray<HistoryRecord>
): TryT<Date> =>
    pipe(
        RArray.head(history),
        Option.map((record) =>
            pipe(
                parseDateTime(`${record.date} ${record.time}`),
                subtractOneHour
            )
        ),
        Either.fromOption(
            () => new Error('Unable to get first history record for date')
        )
    );

const hasPrevClose: PredicateT<Quote> = (quote) => quote.previousClose > 0;

const getStartPrice = (
    time: MarketTime,
    quote: Quote,
    history: ReadonlyArray<HistoryRecord>
): TryT<number> =>
    match({ time, quote, history })
        .with(
            {
                time: MarketTime.ONE_DAY,
                quote: P.when(hasPrevClose)
            },
            () => Either.right(quote.previousClose)
        )
        .with({ history: P.when(hasHistory) }, () =>
            pipe(
                RArray.head(history),
                Option.map((_) => _.price),
                Either.fromOption(
                    () => new Error('Unable to get start price from history')
                )
            )
        )
        .with(
            { time: P.not(MarketTime.ONE_DAY), history: P.when(hasNoHistory) },
            () => Either.right(0)
        )
        .otherwise(() => Either.left(new Error('Unable to get start price')));

const notEqualToHistoryStartPrice =
    (historyStartPrice: number): PredicateT<number> =>
    (startPrice) =>
        startPrice !== historyStartPrice;

const updateHistory = (
    time: MarketTime,
    startPrice: number,
    history: ReadonlyArray<HistoryRecord>
): TryT<ReadonlyArray<HistoryRecord>> => {
    const historyStartPrice = pipe(
        RArray.head(history),
        Option.map((_) => _.price),
        Option.getOrElse(() => -1)
    );
    return match({ time, history, startPrice })
        .with(
            {
                time: MarketTime.ONE_DAY,
                history: P.when(hasHistory),
                startPrice: P.when(
                    notEqualToHistoryStartPrice(historyStartPrice)
                )
            },
            () =>
                pipe(
                    getFirstHistoryRecordDate(history),
                    Either.map((date) =>
                        RArray.prepend({
                            date: formatDate(date),
                            unixTimestampMillis: date.getTime(),
                            time: formatTime(date),
                            price: startPrice
                        })(history)
                    )
                )
        )
        .otherwise(() => Either.right(history));
};

const priceAndPrevCloseEqual: PredicateT<Quote> = (quote) =>
    quote.previousClose === quote.price;

const hasHistory: PredicateT<ReadonlyArray<HistoryRecord>> = (history) =>
    history.length > 0;

const hasNoHistory: PredicateT<ReadonlyArray<HistoryRecord>> = (history) =>
    history.length === 0;

const getCurrentPrice = (
    info: InvestmentInfo,
    time: MarketTime,
    quote: Quote,
    history: ReadonlyArray<HistoryRecord>
): number => {
    const mostRecentHistoryRecord = getMostRecentHistoryRecord(history);
    const mostRecentHistoryPrice = pipe(
        mostRecentHistoryRecord,
        Option.map((_) => _.price),
        Option.getOrElse(() => quote.price)
    );
    return match({
        type: info.type,
        time,
        quote,
        mostRecentHistoryRecord
    })
        .with(
            {
                type: P.when(isStock),
                time: MarketTime.ONE_DAY,
                mostRecentHistoryRecord: P.when(isLaterThanNow)
            },
            () => mostRecentHistoryPrice
        )
        .with(
            { quote: P.when(priceAndPrevCloseEqual) },
            () => mostRecentHistoryPrice
        )
        .otherwise(() => quote.price);
};

const notEmpty = (value?: string): boolean => (value?.length ?? 0) > 0;

const getInvestmentName = (info: InvestmentInfo, quote: Quote): string =>
    match({ info, quote })
        .with({ info: { name: P.when(notEmpty) } }, () => info.name)
        .otherwise(() => quote.name);

export const handleInvestmentData = (
    time: MarketTime,
    info: InvestmentInfo,
    quote: Quote,
    history: ReadonlyArray<HistoryRecord>
): TryT<InvestmentData> => {
    const currentPrice = getCurrentPrice(info, time, quote, history);
    return pipe(
        getStartPrice(time, quote, history),
        Either.bindTo('startPrice'),
        Either.bind('newHistory', ({ startPrice }) =>
            updateHistory(time, startPrice, history)
        ),
        Either.map(
            ({ startPrice, newHistory }): InvestmentData => ({
                name: getInvestmentName(info, quote),
                startPrice,
                currentPrice,
                history: newHistory
            })
        )
    );
};
