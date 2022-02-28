import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAllMarketInvestmentInfo } from '../../../../src/data/MarketPageInvestmentParsing';
import { pipe } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { MarketInvestmentInfo } from '../../../../src/types/data/MarketInvestmentInfo';
import { createSetupMockApiCalls } from './setupMarketTestData';
import { MarketTime } from '../../../../src/types/MarketTime';
import { createRenderApp } from '../../../testutils/RenderApp';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { menuItemIsSelected } from '../../../testutils/menuUtils';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);
const investmentInfo: ReadonlyArray<MarketInvestmentInfo> = pipe(
	getAllMarketInvestmentInfo(),
	Try.getOrThrow
);

const setupMockApiCalls = createSetupMockApiCalls(mockApi, investmentInfo);

const selectMenuItem = async (text: string) => {
	await act(async () => {
		await userEvent.click(screen.getByText('1 Week'));
	});
	menuItemIsSelected(text);
};

const testPageHeaders = () => {
	expect(screen.queryByText('All Markets')).toBeInTheDocument();
	expect(screen.queryByText('US Markets')).toBeInTheDocument();
	expect(screen.queryByText('International Markets')).toBeInTheDocument();
	expect(screen.queryByText('Cryptocurrency')).toBeInTheDocument();
};

interface MarketTestConfig {
	readonly time: MarketTime;
}

const testMarketsPage = (config: MarketTestConfig) => {
	throw new Error();
};

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY
		});
		await renderApp();
		await selectMenuItem('Today');
		testPageHeaders();
		testMarketsPage({
			time: MarketTime.ONE_DAY
		});
	});

	it('renders for today when history has higher millis than current time', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY
		});
		await renderApp();
		await selectMenuItem('Today');
		testPageHeaders();
		throw new Error();
	});

	it('renders for today with market closed', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY,
			status: 'closed'
		});
		await renderApp();
		await selectMenuItem('Today');
		testPageHeaders();
		throw new Error();
	});

	it('renders for 1 week', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_WEEK
		});
		await renderApp();
		await selectMenuItem('1 Week');
		testPageHeaders();
		testMarketsPage({
			time: MarketTime.ONE_WEEK
		});
	});

	it('renders for 1 month', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_MONTH
		});
		await renderApp();
		await selectMenuItem('1 Month');
		testPageHeaders();
		testMarketsPage({
			time: MarketTime.ONE_MONTH
		});
	});

	it('renders for 3 months', async () => {
		setupMockApiCalls({
			time: MarketTime.THREE_MONTHS
		});
		await renderApp();
		await selectMenuItem('3 Months');
		testPageHeaders();
		testMarketsPage({
			time: MarketTime.THREE_MONTHS
		});
	});

	it('renders for 1 year', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_YEAR
		});
		await renderApp();
		await selectMenuItem('1 Year');
		testPageHeaders();
		testMarketsPage({
			time: MarketTime.ONE_YEAR
		});
	});

	it('renders for 5 years', async () => {
		setupMockApiCalls({
			time: MarketTime.FIVE_YEARS
		});
		await renderApp();
		await selectMenuItem('5 Years');
		testPageHeaders();
		testMarketsPage({
			time: MarketTime.FIVE_YEARS
		});
	});
});
