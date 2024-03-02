import { marketTrackerApiFpTs } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { pipe } from 'fp-ts/function';
import * as Try from '@craigmiller160/ts-functions/Try';
import { type MarketInvestmentInfo } from '../../../../src/types/data/MarketInvestmentInfo';
import { createSetupMockApiCalls } from './setupMarketTestData';
import { MarketTime } from '../../../../src/types/MarketTime';
import { renderApp } from '../../../testutils/RenderApp';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMenuItem, menuItemIsSelected } from '../../../testutils/menuUtils';
import * as TaskEither from 'fp-ts/TaskEither';
import { match, P } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../../src/utils/timeUtils';
import { MarketStatus } from '../../../../src/types/MarketStatus';
import { allMarketInvestmentInfo } from '../../../../src/data/MarketPageInvestmentParsing';
import {
	InvestmentType,
	isStock
} from '../../../../src/types/data/InvestmentType';
import {
	BASE_HISTORY_1_PRICE,
	BASE_HISTORY_2_PRICE,
	BASE_LAST_PRICE,
	BASE_PREV_CLOSE_PRICE
} from '../../../testutils/testDataUtils';
import { MarketInvestmentType } from '../../../../src/types/data/MarketInvestmentType';
import { TaskTry } from '@craigmiller160/ts-functions';

enum CurrentPriceStrategy {
	QUOTE,
	HISTORY
}

const localeOptions: Intl.NumberFormatOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 4
};

const mockApi = new MockAdapter(marketTrackerApiFpTs.instance);
const investmentInfo: ReadonlyArray<MarketInvestmentInfo> = pipe(
	allMarketInvestmentInfo,
	Try.getOrThrow
);

const setupMockApiCalls = createSetupMockApiCalls(mockApi, investmentInfo);

const selectMenuItem = async (text: string) => {
	const menuItem = getMenuItem(text);
	await userEvent.click(menuItem);
	menuItemIsSelected(text);
};

const testPageHeaders = () => {
	expect(screen.getByText('All Markets')).toBeInTheDocument();
	expect(screen.getByText('US Markets')).toBeInTheDocument();
	expect(screen.getByText('International Markets')).toBeInTheDocument();
	expect(screen.getByText('Cryptocurrency')).toBeInTheDocument();
};

interface MarketTestConfig {
	readonly time: MarketTime;
	readonly status?: MarketStatus;
	readonly currentPriceStrategy?: CurrentPriceStrategy;
}

const handleValidationError =
	(symbol: string, maybeCard: HTMLElement | null) =>
	(ex: Error): Error => {
		console.error('Investment card validation failure for symbol', symbol);
		if (maybeCard) {
			// eslint-disable-next-line testing-library/no-debugging-utils
			screen.debug(maybeCard);
		}
		return ex;
	};

const validateCardTitle = (card: HTMLElement, info: MarketInvestmentInfo) => {
	const title = within(card).queryByText(RegExp(`\\(${info.symbol}\\)`));
	expect(title).toHaveTextContent(`(${info.symbol}) ${info.name}`);
};

const validateCardSinceDate = (card: HTMLElement, time: MarketTime) => {
	const startDate = match(time)
		.with(MarketTime.ONE_DAY, getTodayDisplayDate)
		.with(MarketTime.ONE_WEEK, getOneWeekDisplayStartDate)
		.with(MarketTime.ONE_MONTH, getOneMonthDisplayStartDate)
		.with(MarketTime.THREE_MONTHS, getThreeMonthDisplayStartDate)
		.with(MarketTime.ONE_YEAR, getOneYearDisplayStartDate)
		.with(MarketTime.FIVE_YEARS, getFiveYearDisplayStartDate)
		.run();

	expect(within(card).queryByText(/\w{3} \d{2}, \d{4}/)).toHaveTextContent(
		`Since ${startDate}`
	);
};

const validateMarketStatus = (
	card: HTMLElement,
	type: InvestmentType,
	status: MarketStatus
) =>
	match({ type, status })
		.with({ type: P.when(isStock), status: MarketStatus.CLOSED }, () => {
			expect(within(card).getByText('Market Closed')).toBeInTheDocument();
			expect(
				within(card).queryByText('Chart is Here')
			).not.toBeInTheDocument();
		})
		.otherwise(() => {
			expect(
				within(card).queryByText('Market Closed')
			).not.toBeInTheDocument();
			expect(within(card).getByText('Chart is Here')).toBeInTheDocument();
		});

const validatePriceLine = (
	card: HTMLElement,
	type: InvestmentType,
	config: MarketTestConfig,
	modifier: number
) => {
	const {
		time,
		status = MarketStatus.OPEN,
		currentPriceStrategy = CurrentPriceStrategy.QUOTE
	} = config;

	const baseCurrentPrice = match({ type, currentPriceStrategy })
		.with(
			{
				type: P.when(isStock),
				currentPriceStrategy: CurrentPriceStrategy.HISTORY
			},
			() => BASE_HISTORY_2_PRICE
		)
		.otherwise(() => BASE_LAST_PRICE);
	const rawCurrentPrice = baseCurrentPrice + modifier;
	const currentPrice = `$${rawCurrentPrice.toLocaleString(
		undefined,
		localeOptions
	)}`;

	const baseInitialPrice = match({ type, time })
		.with(
			{ type: P.when(isStock), time: MarketTime.ONE_DAY },
			() => BASE_PREV_CLOSE_PRICE
		)
		.otherwise(() => BASE_HISTORY_1_PRICE);
	const rawInitialPrice = baseInitialPrice + modifier;
	const rawDiff = rawCurrentPrice - rawInitialPrice;
	const diff = `$${rawDiff.toLocaleString(undefined, localeOptions)}`;
	const rawPercent = (rawDiff / rawInitialPrice) * 100;
	const percent = `${rawPercent.toLocaleString(undefined, localeOptions)}%`;

	const expectedPriceLineText = `(+${diff}, +${percent})`;

	const currentPriceResult = within(card).queryByText(currentPrice);
	match({ type, status })
		.with({ type: P.when(isStock), status: MarketStatus.CLOSED }, () => {
			expect(currentPriceResult).toBeInTheDocument();
			expect(within(card).getByText('Market Closed')).toBeInTheDocument();
		})
		.otherwise(() => expect(currentPriceResult).toBeInTheDocument());

	const priceLine = within(card).queryByText(/\([+|-]\$.*\)/);
	match({ type, status })
		.with({ type: P.when(isStock), status: MarketStatus.CLOSED }, () =>
			expect(priceLine).not.toBeInTheDocument()
		)
		.otherwise(() =>
			expect(priceLine).toHaveTextContent(expectedPriceLineText)
		);
};

const validateInvestmentCard = (
	marketsPage: HTMLElement,
	info: MarketInvestmentInfo,
	config: MarketTestConfig,
	modifier: number
) => {
	const maybeCard = within(marketsPage).queryByTestId(
		`market-card-${info.symbol}`
	);
	pipe(
		TaskTry.tryCatch(async () => {
			expect(maybeCard).not.toBeUndefined();
			const card = maybeCard!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
			await waitFor(() => validateCardTitle(card, info));
			validateCardSinceDate(card, config.time);
			validateMarketStatus(
				card,
				info.type,
				config.status ?? MarketStatus.OPEN
			);
			validatePriceLine(card, info.type, config, modifier);
		}),
		TaskEither.mapLeft(handleValidationError(info.symbol, maybeCard)),
		TaskTry.getOrThrow
	);
};

const testMarketsPage = async (config: MarketTestConfig) => {
	const marketsPage = screen.getByTestId('markets-page');
	await userEvent.click(screen.getByText('US Markets'));

	investmentInfo.forEach((info, index) => {
		if (info.marketType === MarketInvestmentType.USA_ETF) {
			validateInvestmentCard(marketsPage, info, config, index);
		}
	});

	await userEvent.click(screen.getByText('International Markets'));
	investmentInfo.forEach((info, index) => {
		if (info.marketType === MarketInvestmentType.INTERNATIONAL_ETF) {
			validateInvestmentCard(marketsPage, info, config, index);
		}
	});

	await userEvent.click(screen.getByText('Cryptocurrency'));
	investmentInfo.forEach((info, index) => {
		if (info.marketType === MarketInvestmentType.CRYPTO) {
			validateInvestmentCard(marketsPage, info, config, index);
		}
	});
};

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
		mockApi.onGet('/oauth/user').passThrough();
	});

	it('dummy test to allow this file to exist', () => {
		expect(true).toEqual(true);
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for today', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('Today');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.ONE_DAY
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for today when history has higher millis than current time', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY,
			tradierTimesaleBaseMillis: new Date().getTime() + 100_000
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('Today');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.ONE_DAY,
			currentPriceStrategy: CurrentPriceStrategy.HISTORY
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for today with market closed', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_DAY,
			status: 'closed'
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('Today');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.ONE_DAY,
			status: MarketStatus.CLOSED
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for 1 week', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_WEEK
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('1 Week');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.ONE_WEEK
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for 1 month', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_MONTH
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('1 Month');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.ONE_MONTH
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for 3 months', async () => {
		setupMockApiCalls({
			time: MarketTime.THREE_MONTHS
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('3 Months');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.THREE_MONTHS
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for 1 year', async () => {
		setupMockApiCalls({
			time: MarketTime.ONE_YEAR
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('1 Year');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.ONE_YEAR
		});
	});

	// eslint-disable-next-line vitest/expect-expect
	it('renders for 5 years', async () => {
		setupMockApiCalls({
			time: MarketTime.FIVE_YEARS
		});
		renderApp();
		await screen.findByText('Markets');
		await selectMenuItem('5 Years');
		testPageHeaders();
		await testMarketsPage({
			time: MarketTime.FIVE_YEARS
		});
	});
});
