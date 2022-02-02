import { act, screen, within } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { menuItemIsSelected } from '../../../testutils/menuUtils';
import userEvent from '@testing-library/user-event';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import { TradierHistory } from '../../../../src/types/tradier/history';

const formatDate = Time.format('yyyy-MM-dd');
const today = formatDate(new Date());

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

const mockQuote: TradierQuotes = {
	quotes: {
		quote: {
			symbol: 'VTI',
			description: '',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: 100
		}
	}
};

const mockHistory: TradierHistory = {
	history: {
		day: [
			{
				date: '',
				open: 0,
				high: 0,
				low: 0,
				close: 50
			}
		]
	}
};

interface TestMarketCardsConfig {
	readonly time: string;
	readonly amountDiff: string;
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
	const amountItem = within(vtiCard).queryByText(/\$100\.00/);
	expect(amountItem?.textContent).toEqual(
		`$100.00 (${config.amountDiff}, ${config.amountDiffPercent})`
	);
	expect(within(vtiCard).queryByText('Chart Goes Here')).toBeInTheDocument();
};

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		await renderApp();
		menuItemIsSelected('Today');

		expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
		expect(screen.queryByText('US Markets')).toBeInTheDocument();
		expect(screen.queryByText('International Markets')).toBeInTheDocument();

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: 'Today',
			amountDiff: '+$100.00',
			amountDiffPercent: '+100.00%'
		});
	});

	it('renders for 1 week', async () => {
		const start = pipe(new Date(), Time.subWeeks(1), formatDate);

		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		mockApi
			.onGet(
				`/tradier/markets/history?symbol=VTI&start=${start}&end=${today}&interval=daily`
			)
			.reply(200, mockHistory);

		await renderApp();

		expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
		expect(screen.queryByText('US Markets')).toBeInTheDocument();
		expect(screen.queryByText('International Markets')).toBeInTheDocument();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Week'));
		});

		menuItemIsSelected('1 Week');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '1 Week',
			amountDiff: '+$50.00',
			amountDiffPercent: '+50.00%'
		});
	});

	it('renders for 1 month', async () => {
		const start = pipe(new Date(), Time.subMonths(1), formatDate);

		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		mockApi
			.onGet(
				`/tradier/markets/history?symbol=VTI&start=${start}&end=${today}&interval=daily`
			)
			.reply(200, mockHistory);

		await renderApp();

		expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
		expect(screen.queryByText('US Markets')).toBeInTheDocument();
		expect(screen.queryByText('International Markets')).toBeInTheDocument();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Month'));
		});

		menuItemIsSelected('1 Month');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '1 Month',
			amountDiff: '+$50.00',
			amountDiffPercent: '+50.00%'
		});
	});

	it('renders for 3 months', async () => {
		const start = pipe(new Date(), Time.subMonths(3), formatDate);

		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		mockApi
			.onGet(
				`/tradier/markets/history?symbol=VTI&start=${start}&end=${today}&interval=daily`
			)
			.reply(200, mockHistory);

		await renderApp();

		expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
		expect(screen.queryByText('US Markets')).toBeInTheDocument();
		expect(screen.queryByText('International Markets')).toBeInTheDocument();

		await act(async () => {
			await userEvent.click(screen.getByText('3 Months'));
		});

		menuItemIsSelected('3 Months');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '3 Months',
			amountDiff: '+$50.00',
			amountDiffPercent: '+50.00%'
		});
	});

	it('renders for 1 year', async () => {
		const start = pipe(new Date(), Time.subYears(1), formatDate);

		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		mockApi
			.onGet(
				`/tradier/markets/history?symbol=VTI&start=${start}&end=${today}&interval=weekly`
			)
			.reply(200, mockHistory);

		await renderApp();

		expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
		expect(screen.queryByText('US Markets')).toBeInTheDocument();
		expect(screen.queryByText('International Markets')).toBeInTheDocument();

		await act(async () => {
			await userEvent.click(screen.getByText('1 Year'));
		});

		menuItemIsSelected('1 Year');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '1 Year',
			amountDiff: '+$50.00',
			amountDiffPercent: '+50.00%'
		});
	});

	it('renders for 5 years', async () => {
		const start = pipe(new Date(), Time.subYears(5), formatDate);

		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		mockApi
			.onGet(
				`/tradier/markets/history?symbol=VTI&start=${start}&end=${today}&interval=monthly`
			)
			.reply(200, mockHistory);

		await renderApp();

		expect(screen.queryByText('All Global Markets')).toBeInTheDocument();
		expect(screen.queryByText('US Markets')).toBeInTheDocument();
		expect(screen.queryByText('International Markets')).toBeInTheDocument();

		await act(async () => {
			await userEvent.click(screen.getByText('5 Years'));
		});

		menuItemIsSelected('5 Years');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		testMarketCards(marketCards, {
			time: '5 Years',
			amountDiff: '+$50.00',
			amountDiffPercent: '+50.00%'
		});
	});
});
