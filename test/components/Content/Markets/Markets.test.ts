import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAllMarketInvestmentInfo } from '../../../../src/data/MarketPageInvestmentParsing';
import { pipe } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { MarketInvestmentInfo } from '../../../../src/types/data/MarketInvestmentInfo';
import { createSetupMockApiCalls } from './setupMarketTestData';

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
		throw new Error();
	});

	it('renders for today when history has higher millis than current time', async () => {
		throw new Error();
	});

	it('renders for today with market closed', async () => {
		throw new Error();
	});

	it('renders for 1 week', async () => {
		throw new Error();
	});

	it('renders for 1 month', async () => {
		throw new Error();
	});

	it('renders for 3 months', async () => {
		throw new Error();
	});

	it('renders for 1 year', async () => {
		throw new Error();
	});

	it('renders for 5 years', async () => {
		throw new Error();
	});
});
