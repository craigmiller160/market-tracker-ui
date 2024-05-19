import { format, subDays } from 'date-fns/fp';
type Chainable<T> = Cypress.Chainable<T>;
import { flow } from 'fp-ts/function';
import { match } from 'ts-pattern';
import { type HistoryTime } from './common';

const formatYear = format('yyyy');
const formatMonth = format('MM');
const formatDate = format('yyyy-MM-dd');
const toOneWeekStart: (d: Date) => string = flow(subDays(7), formatDate);

const getInterval = (time: HistoryTime): string =>
    match(time)
        .with('1week', () => 'daily')
        .run();
const getFixture = (time: HistoryTime): string =>
    match(time)
        .with('1week', () => 'tradier_history_1week_vti.json')
        .run();

const getCalendar = (): Chainable<null> => {
    const date = new Date();
    const year = formatYear(date);
    const month = formatMonth(date);
    return cy.intercept(
        `/market-tracker/api/tradier/markets/calendar?year=${year}&month=${month}`,
        {
            fixture: 'calendar.json'
        }
    );
};

const getStockData = (symbol: string, time: HistoryTime): Chainable<null> => {
    const date = new Date();
    const start = toOneWeekStart(date);
    const end = formatDate(date);
    const interval = getInterval(time);
    const historyFixture = getFixture(time);

    return cy
        .intercept(
            `/market-tracker/api/tradier/markets/quotes?symbols=${symbol}`,
            {
                fixture: 'tradier_quote_vti.json'
            }
        )
        .as(`tradier_getQuote_${symbol}`)
        .intercept(
            `/market-tracker/api/tradier/markets/history?symbol=${symbol}&start=${start}&end=${end}&interval=${interval}`,
            {
                fixture: historyFixture
            }
        )
        .as(`tradier_getHistory_${symbol}_${time}`);
};

export const tradierApi = {
    getCalendar,
    getStockData
};
