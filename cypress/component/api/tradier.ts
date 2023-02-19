import { format, subDays } from 'date-fns/fp';
import Chainable = Cypress.Chainable;
import { flow } from 'fp-ts/es6/function';
import { match } from 'ts-pattern';

const formatYear = format('yyyy');
const formatMonth = format('MM');
const formatDate = format('yyyy-MM-dd');
const toOneWeekStart: (d: Date) => string = flow(subDays(7), formatDate);

type HistoryTime = 'today' | '1week';

const getInterval = (time: HistoryTime): string =>
	match(time)
		.with('1week', () => 'daily')
		.run();
const getFixture = (time: HistoryTime): string =>
	match(time)
		.with('1week', () => 'history_1week_vti.json')
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
const getQuote = (symbol: string) =>
	cy
		.intercept(
			`/market-tracker/api/tradier/markets/quotes?symbols=${symbol}`,
			{
				fixture: 'quote_vti.json'
			}
		)
		.as(`tradier_getQuote_${symbol}`);

const getHistory = (symbol: string, time: HistoryTime): Chainable<null> => {
	const date = new Date();
	const start = toOneWeekStart(date);
	const end = formatDate(date);
	const interval = getInterval(time);
	const fixture = getFixture(time);

	return cy
		.intercept(
			`/market-tracker/tradier/markets/history?symbol=${symbol}&start=${start}&end=${end}&interval=${interval}`,
			{
				fixture
			}
		)
		.as(`tradier_getHistory_${symbol}_${time}`);
};

export const tradierApi = {
	getCalendar,
	getQuote,
	getHistory
};
