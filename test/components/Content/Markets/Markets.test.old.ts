import { act, screen, within } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import { menuItemIsSelected } from '../../../testutils/menuUtils';
import userEvent from '@testing-library/user-event';
import {
	getFiveYearDisplayStartDate,
	getFiveYearStartDate,
	getOneMonthDisplayStartDate,
	getOneMonthStartDate,
	getOneWeekDisplayStartDate,
	getOneWeekStartDate,
	getOneYearDisplayStartDate,
	getOneYearStartDate,
	getThreeMonthDisplayStartDate,
	getThreeMonthStartDate,
	getTodayDisplayDate
} from '../../../../src/utils/timeUtils';
import { createMockQueries, testDataSettings } from './marketsTestData.old';
import { getAllMarketInvestmentInfo } from '../../../../src/data/MarketPageInvestmentParsing';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import {
	isCrypto,
	isStock
} from '../../../../src/types/data/MarketInvestmentType';
import { match, when } from 'ts-pattern';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

interface TestMarketCardsConfig {
	readonly time: string;
	readonly startDate: string;
	readonly isTimesale?: boolean;
	readonly isCurrentPriceQuote?: boolean;
	readonly isMarketClosed?: boolean;
}

const testMarketsPage = (
	marketsPage: HTMLElement,
	config: TestMarketCardsConfig
) => {
	const isTimesale = config.isTimesale ?? false;
	const isCurrentPriceQuote = config.isCurrentPriceQuote ?? true;
	const marketCards = within(marketsPage).queryAllByRole('listitem');
	expect(marketCards).toHaveLength(10);
	testDataSettings.forEach((setting) => {
		const maybeCard = within(marketsPage).queryByTestId(
			`market-card-${setting.symbol}`
		);
		try {
			expect(maybeCard).not.toBeUndefined();
			const card = maybeCard!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

			const investmentInfo = Try.getOrThrow(getAllMarketInvestmentInfo());

			const name = investmentInfo.find(
				(info) => info.symbol === setting.symbol
			)?.name;
			expect(name).not.toBeUndefined();
			const title = within(card).queryByText(
				RegExp(`\\(${setting.symbol}\\)`)
			);
			expect(title).toHaveTextContent(`${name} (${setting.symbol})`);

			expect(within(card).queryByText(config.time)).toBeInTheDocument();
			expect(
				within(card).queryByText(/\w{3} \d{2}, \d{4}/)
			).toHaveTextContent(`Since ${config.startDate}`);

			if (config.isMarketClosed && setting.id === undefined) {
				expect(
					within(card).queryByText('Market Closed')
				).toBeInTheDocument();
				expect(
					within(card).queryByText('Chart is Here')
				).not.toBeInTheDocument();
			} else {
				const priceLine = within(card).queryByText(/\([+|-]\$.*\)/);
				const initialPrice = match({
					isTimesale,
					type: setting.type,
					isCurrentPriceQuote: config.isCurrentPriceQuote
				})
					.with(
						{ type: when(isStock), isTimesale: true },
						() => setting.prevClosePrice
					)
					.with(
						{ type: when(isStock), isTimesale: false },
						() => setting.historyPrice
					)
					.with(
						{ type: when(isCrypto), isTimesale: true },
						() => setting.timesalePrice1
					)
					.with(
						{ type: when(isCrypto), isTimesale: false },
						() => setting.historyPrice
					)
					.run();
				const currentPrice =
					isCurrentPriceQuote || setting.id !== undefined
						? setting.quotePrice
						: setting.timesalePrice2;
				const diff = currentPrice - initialPrice;
				const expectedPrice = `(+$${diff.toFixed(2)}, +${(
					(diff / initialPrice) *
					100
				).toFixed(2)}%)`;
				expect(
					within(card).queryByText(`$${currentPrice.toFixed(2)}`)
				).toBeInTheDocument();
				expect(priceLine).toHaveTextContent(expectedPrice);

				expect(
					within(card).queryByText('Chart is Here')
				).toBeInTheDocument();
			}
		} catch (ex) {
			console.error('Failed Symbol', setting.symbol);
			if (maybeCard) {
				screen.debug(maybeCard);
			}
			throw ex;
		}
	});
};

const testPageHeaders = () => {
	expect(screen.queryByText('All Markets')).toBeInTheDocument();
	expect(screen.queryByText('US Markets')).toBeInTheDocument();
	expect(screen.queryByText('International Markets')).toBeInTheDocument();
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
			isTimesale: true
		});
	});

	it('renders for today when history has higher millis than current time', async () => {
		mockQueries({
			timesaleTimestamp: new Date().getTime() + 1000
		});
		await renderApp();
		menuItemIsSelected('Today');
		testPageHeaders();

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: 'Today',
			startDate: getTodayDisplayDate(),
			isTimesale: true,
			isCurrentPriceQuote: false
		});
	});

	it('renders for today with market closed', async () => {
		mockQueries({
			timesaleTimestamp: new Date().getTime() + 1000,
			isMarketClosed: true
		});
		await renderApp();
		menuItemIsSelected('Today');
		testPageHeaders();

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: 'Today',
			startDate: getTodayDisplayDate(),
			isTimesale: true,
			isCurrentPriceQuote: false,
			isMarketClosed: true
		});
	});

	it('renders for 1 week', async () => {
		mockQueries({
			start: getOneWeekStartDate(),
			tradierInterval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Week'));
		});

		menuItemIsSelected('1 Week');

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: '1 Week',
			startDate: getOneWeekDisplayStartDate(),
			isTimesale: false
		});
	});

	it('renders for 1 month', async () => {
		mockQueries({
			start: getOneMonthStartDate(),
			tradierInterval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Month'));
		});

		menuItemIsSelected('1 Month');

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: '1 Month',
			startDate: getOneMonthDisplayStartDate(),
			isTimesale: false
		});
	});

	it('renders for 3 months', async () => {
		mockQueries({
			start: getThreeMonthStartDate(),
			tradierInterval: 'daily'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('3 Months'));
		});

		menuItemIsSelected('3 Months');

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: '3 Months',
			startDate: getThreeMonthDisplayStartDate(),
			isTimesale: false
		});
	});

	it('renders for 1 year', async () => {
		mockQueries({
			start: getOneYearStartDate(),
			tradierInterval: 'weekly'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Year'));
		});

		menuItemIsSelected('1 Year');

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: '1 Year',
			startDate: getOneYearDisplayStartDate(),
			isTimesale: false
		});
	});

	it('renders for 5 years', async () => {
		mockQueries({
			start: getFiveYearStartDate(),
			tradierInterval: 'monthly'
		});

		await renderApp();
		testPageHeaders();

		await act(async () => {
			await userEvent.click(screen.getByText('5 Years'));
		});

		menuItemIsSelected('5 Years');

		const marketsPage = screen.getByTestId('markets-page');
		testMarketsPage(marketsPage, {
			time: '5 Years',
			startDate: getFiveYearDisplayStartDate(),
			isTimesale: false
		});
	});
});
