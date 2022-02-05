import { act, screen, within } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import { menuItemIsSelected } from '../../../testutils/menuUtils';
import userEvent from '@testing-library/user-event';
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
	getTodayDisplayDate
} from '../../../../src/utils/timeUtils';
import { match } from 'ts-pattern';
import { createMockQueries, testDataSettings } from './marketsTestData';
import { MARKET_INFO } from '../../../../src/components/Content/Markets/MarketInfo';

type HistoryApiType = 'timesale' | 'history';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

interface TestMarketCardsConfig {
	readonly time: string;
	readonly price?: string; // TODO delete this
	readonly amountDiff: string; // TODO delete this
	readonly startDate: string;
	readonly amountDiffPercent: string; // TODO delete this
}

const testMarketsPage = (
	marketsPage: HTMLElement,
	config: TestMarketCardsConfig
) => {
	const marketCards = within(marketsPage).queryAllByRole('market-card');
	expect(marketCards).toHaveLength(7);
	testDataSettings.forEach((setting) => {
		const maybeCard = within(marketsPage).queryByTestId(`market-card-${setting.symbol}`)
		expect(maybeCard).not.toBeUndefined();
		const card = maybeCard!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

		const name = MARKET_INFO.find((info) => info.symbol === setting.symbol)?.name;
		expect(name).not.toBeUndefined();
		const title = within(card).queryByText(RegExp(`\\(${setting.symbol}\\)`));
		expect(title).toHaveTextContent(`${name} (${setting.symbol})`);

		expect(within(card).queryByText(config.time)).toBeInTheDocument();
		expect(within(card).queryByText(/\w{3} \d{2}, \d{4}/)).toHaveTextContent(
			`Since ${config.startDate}`
		);
		const priceLine = within(card).queryByText(/\([+|-]\$.*\)/);
		const expectedPrice = `${setting.quotePrice} `;
		console.log(priceLine?.textContent);

		expect(within(card).queryByText('Chart is Here')).toBeInTheDocument();
	});

	// const price = config.price ?? '$100.00';
	// expect(within(vtiCard).queryByText(/\([+|-]\$.*\)/)).toHaveTextContent(
	// 	`${price} (${config.amountDiff}, ${config.amountDiffPercent})`
	// );

};

const testPageHeaders = () => {
	expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
	expect(screen.queryByText('US Markets')).toBeInTheDocument();
	expect(screen.queryByText('International Markets')).toBeInTheDocument();
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

const mockQueries = createMockQueries(mockApi);

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		mockQueries();
		await renderApp();
		menuItemIsSelected('Today');
		testPageHeaders();

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: 'Today',
			startDate: getTodayDisplayDate(),
			amountDiff: '+$50.00',
			amountDiffPercent: '+100.00%'
		});
		// verifyApiCalls(['VTI'], 'timesale', true);
		// TODO restore verification
	});

	it('renders for today when history has higher millis than current time', async () => {
		mockQueries({
			timesaleTimestamp: new Date().getTime() + 1000
		});
		await renderApp();
		menuItemIsSelected('Today');
		testPageHeaders();

		// const marketsPage = screen.getByTestId('markets-page');
		// testMarketsPage(marketsPage, {
		// 	time: 'Today',
		// 	price: '$69.00',
		// 	startDate: getTodayDisplayDate(),
		// 	amountDiff: '+$19.00',
		// 	amountDiffPercent: '+38.00%'
		// });
		// verifyApiCalls(['VTI'], 'timesale', false);
		throw new Error();
	});

	it('renders for 1 week', async () => {
		mockQueries({
			start: getOneWeekHistoryStartDate(),
			interval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Week'));
		});

		menuItemIsSelected('1 Week');

		// const marketsPage = screen.getByTestId('markets-page');
		// testMarketsPage(marketsPage, {
		// 	time: '1 Week',
		// 	startDate: getOneWeekDisplayStartDate(),
		// 	amountDiff: '+$50.00',
		// 	amountDiffPercent: '+100.00%'
		// });
		// verifyApiCalls(['VTI'], 'history', true);
		throw new Error();
	});

	it('renders for 1 month', async () => {
		mockQueries({
			start: getOneMonthHistoryStartDate(),
			interval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Month'));
		});

		menuItemIsSelected('1 Month');

		// const marketsPage = screen.getByTestId('markets-page');
		// testMarketsPage(marketsPage, {
		// 	time: '1 Month',
		// 	startDate: getOneMonthDisplayStartDate(),
		// 	amountDiff: '+$50.00',
		// 	amountDiffPercent: '+100.00%'
		// });
		// verifyApiCalls(['VTI'], 'history', true);
		throw new Error();
	});

	it('renders for 3 months', async () => {
		mockQueries({
			start: getThreeMonthHistoryStartDate(),
			interval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('3 Months'));
		});

		menuItemIsSelected('3 Months');

		// const marketsPage = screen.getByTestId('markets-page');
		// testMarketsPage(marketsPage, {
		// 	time: '3 Months',
		// 	startDate: getThreeMonthDisplayStartDate(),
		// 	amountDiff: '+$50.00',
		// 	amountDiffPercent: '+100.00%'
		// });
		// verifyApiCalls(['VTI'], 'history', true);
		throw new Error();
	});

	it('renders for 1 year', async () => {
		mockQueries({
			start: getOneYearHistoryStartDate(),
			interval: 'weekly'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Year'));
		});

		menuItemIsSelected('1 Year');

		// const marketsPage = screen.getByTestId('markets-page');
		// testMarketsPage(marketsPage, {
		// 	time: '1 Year',
		// 	startDate: getOneYearDisplayStartDate(),
		// 	amountDiff: '+$50.00',
		// 	amountDiffPercent: '+100.00%'
		// });
		// verifyApiCalls(['VTI'], 'history', true);
		throw new Error();
	});

	it('renders for 5 years', async () => {
		mockQueries({
			start: getFiveYearHistoryStartDate(),
			interval: 'monthly'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('5 Years'));
		});

		menuItemIsSelected('5 Years');

		// const marketsPage = screen.getByTestId('markets-page');
		// testMarketsPage(marketsPage, {
		// 	time: '5 Years',
		// 	startDate: getFiveYearDisplayStartDate(),
		// 	amountDiff: '+$50.00',
		// 	amountDiffPercent: '+100.00%'
		// });
		// verifyApiCalls(['VTI'], 'history', true);
		throw new Error();
	});
});
