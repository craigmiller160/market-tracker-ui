import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAllMarketInvestmentInfo } from '../../../../src/data/MarketPageInvestmentParsing';
import { pipe } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { MarketInvestmentInfo } from '../../../../src/types/data/MarketInvestmentInfo';
import { createSetupMockApiCalls } from './setupMarketTestData';
import { MarketTime } from '../../../../src/types/MarketTime';

const mockApi = new MockAdapter(ajaxApi.instance);
const investmentInfo: ReadonlyArray<MarketInvestmentInfo> = pipe(
	getAllMarketInvestmentInfo(),
	Try.getOrThrow
);

const setupMockApiCalls = createSetupMockApiCalls(mockApi, investmentInfo);

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY
		});
		throw new Error();
	});

	it('renders for today when history has higher millis than current time', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY
		});
		throw new Error();
	});

	it('renders for today with market closed', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY,
			status: 'closed'
		});
		throw new Error();
	});

	it('renders for 1 week', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_WEEK
		});
		throw new Error();
	});

	it('renders for 1 month', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_MONTH
		});
		throw new Error();
	});

	it('renders for 3 months', async () => {
		setupMockApiCalls({
			time: MarketTime.THREE_MONTHS
		});
		throw new Error();
	});

	it('renders for 1 year', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_YEAR
		});
		throw new Error();
	});

	it('renders for 5 years', async () => {
		setupMockApiCalls({
			time: MarketTime.FIVE_YEARS
		});
		throw new Error();
	});
});
