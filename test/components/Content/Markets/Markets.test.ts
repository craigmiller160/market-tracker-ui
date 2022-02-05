import { act, screen, within } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import { menuItemIsSelected } from '../../../testutils/menuUtils';
import userEvent from '@testing-library/user-event';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import {
	getFiveYearDisplayStartDate,
	getFiveYearHistoryStartDate,
	getOneMonthDisplayStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekDisplayStartDate,
	getOneWeekHistoryStartDate,
	getOneYearDisplayStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthDisplayStartDate,
	getThreeMonthHistoryStartDate,
	getTimesalesEnd,
	getTimesalesStart,
	getTodayDisplayDate
} from '../../../../src/utils/timeUtils';
import { match } from 'ts-pattern';

type HistoryApiType = 'timesale' | 'history';

const formatDate = Time.format('yyyy-MM-dd');
const today = formatDate(new Date());
const timesalesStart = getTimesalesStart();
const timesalesEnd = getTimesalesEnd();

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

interface TestMarketCardsConfig {
	readonly time: string;
	readonly price?: string;
	readonly amountDiff: string;
	readonly startDate: string;
	readonly amountDiffPercent: string;
}

const testMarketCards = (
	marketCards: ReadonlyArray<HTMLElement>,
	config: TestMarketCardsConfig
) => {
	expect(marketCards).toHaveLength(1);
	const vtiCard = marketCards[0];
	expect(
		within(vtiCard).queryByText('US Total Market (VTI)')
	).toBeInTheDocument();
	expect(within(vtiCard).queryByText(config.time)).toBeInTheDocument();
	expect(within(vtiCard).queryByText(/\w{3} \d{2}, \d{4}/)).toHaveTextContent(
		`Since ${config.startDate}`
	);
	const price = config.price ?? '$100.00';
	expect(within(vtiCard).queryByText(/\([+|-]\$.*\)/)).toHaveTextContent(
		`${price} (${config.amountDiff}, ${config.amountDiffPercent})`
	);
	expect(within(vtiCard).queryByText('Chart is Here')).toBeInTheDocument();
};

const testPageHeaders = () => {
	expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
	expect(screen.queryByText('US Markets')).toBeInTheDocument();
	expect(screen.queryByText('International Markets')).toBeInTheDocument();
};

interface MockQueriesConfig {
	readonly symbols: ReadonlyArray<string>;
	readonly start?: string;
	readonly interval?: string;
	readonly timesaleTimestamp?: number;
}

const mockQueries = (config: MockQueriesConfig) => {
	const {
		symbols,
		start = '',
		interval = '',
		timesaleTimestamp = 0
	} = config;
	mockApi
		.onGet(`/tradier/markets/quotes?symbols=${symbols.join(',')}`)
		.reply(200, mockQuote);
	symbols.forEach((symbol) => {
		mockApi
			.onGet(
				`/tradier/markets/history?symbol=${symbol}&start=${start}&end=${today}&interval=${interval}`
			)
			.reply(200, mockHistory);
		mockApi
			.onGet(
				`/tradier/markets/timesales?symbol=${symbol}&start=${timesalesStart}&end=${timesalesEnd}&interval=5min`
			)
			.reply(200, createTimesale(timesaleTimestamp));
	});
};

interface ApiCallCount {
	readonly apiCallCount: number;
	readonly historyApiIndex: number;
	readonly quoteApiIndex: number;
}

const verifyApiCalls = (
	symbols: ReadonlyArray<string>,
	historyApiType: HistoryApiType,
	useQuote: boolean
) => {
	const historyApiRegex = match(historyApiType)
		.with('timesale', () => /\/tradier\/markets\/timesales/)
		.with('history', () => /\/tradier\/markets\/history/)
		.run();

	const { apiCallCount, historyApiIndex, quoteApiIndex }: ApiCallCount =
		match({ historyApiType, useQuote })
			.with({ historyApiType: 'timesale', useQuote: false }, () => ({
				apiCallCount: 2,
				historyApiIndex: 1,
				quoteApiIndex: -1
			}))
			.with({ historyApiType: 'timesale', useQuote: true }, () => ({
				apiCallCount: 3,
				historyApiIndex: 1,
				quoteApiIndex: 2
			}))
			.with({ historyApiType: 'history' }, () => ({
				apiCallCount: 5,
				historyApiIndex: 3,
				quoteApiIndex: 4
			}))
			.run();

	expect(mockApi.history.get).toHaveLength(apiCallCount);

	expect(mockApi.history.get[historyApiIndex].url).toEqual(
		expect.stringMatching(historyApiRegex)
	);
	symbols.forEach((symbol) => {
		expect(mockApi.history.get[historyApiIndex].url).toEqual(
			expect.stringMatching(`symbol=${symbol}`)
		);
	});

	if (useQuote) {
		symbols.forEach((symbol) => {
			expect(mockApi.history.get[quoteApiIndex].url).toEqual(
				expect.stringMatching(
					`/tradier/markets/quotes\\?symbols=${symbol}`
				)
			);
		});
	}
};

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		mockQueries({
			symbols: ['VTI']
		});
		await renderApp();
		menuItemIsSelected('Today');
		testPageHeaders();

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: 'Today',
			startDate: getTodayDisplayDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		verifyApiCalls(['VTI'], 'timesale', true);
	});

	it('renders for today when history has higher millis than current time', async () => {
		mockQueries({
			symbols: ['VTI'],
			timesaleTimestamp: new Date().getTime() + 1000
		});
		await renderApp();
		menuItemIsSelected('Today');
		testPageHeaders();

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: 'Today',
			price: '$69.00',
			startDate: getTodayDisplayDate(),
			amountDiff: '+$19.00',
			amountDiffPercent: '+38.00%'
		});
		verifyApiCalls(['VTI'], 'timesale', false);
	});

	it('renders for 1 week', async () => {
		mockQueries({
			symbols: ['VTI'],
			start: getOneWeekHistoryStartDate(),
			interval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Week'));
		});

		menuItemIsSelected('1 Week');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '1 Week',
			startDate: getOneWeekDisplayStartDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		verifyApiCalls(['VTI'], 'history', true);
	});

	it('renders for 1 month', async () => {
		mockQueries({
			symbols: ['VTI'],
			start: getOneMonthHistoryStartDate(),
			interval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Month'));
		});

		menuItemIsSelected('1 Month');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '1 Month',
			startDate: getOneMonthDisplayStartDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		verifyApiCalls(['VTI'], 'history', true);
	});

	it('renders for 3 months', async () => {
		mockQueries({
			symbols: ['VTI'],
			start: getThreeMonthHistoryStartDate(),
			interval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('3 Months'));
		});

		menuItemIsSelected('3 Months');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '3 Months',
			startDate: getThreeMonthDisplayStartDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		verifyApiCalls(['VTI'], 'history', true);
	});

	it('renders for 1 year', async () => {
		mockQueries({
			symbols: ['VTI'],
			start: getOneYearHistoryStartDate(),
			interval: 'weekly'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Year'));
		});

		menuItemIsSelected('1 Year');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '1 Year',
			startDate: getOneYearDisplayStartDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		verifyApiCalls(['VTI'], 'history', true);
	});

	it('renders for 5 years', async () => {
		mockQueries({
			symbols: ['VTI'],
			start: getFiveYearHistoryStartDate(),
			interval: 'monthly'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('5 Years'));
		});

		menuItemIsSelected('5 Years');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '5 Years',
			startDate: getFiveYearDisplayStartDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		verifyApiCalls(['VTI'], 'history', true);
	});
});
