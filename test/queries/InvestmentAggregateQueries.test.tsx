import { test, expect } from 'vitest';
import { server } from '../testutils/msw-server';
import type {
	TradierQuote,
	TradierQuotes
} from '../../src/types/tradier/quotes';
import {
	type DefaultBodyType,
	http,
	type HttpHandler,
	HttpResponse,
	type PathParams
} from 'msw';
import { format, getMonth, getYear } from 'date-fns';
import type {
	TradierCalendar,
	TradierCalendarStatus
} from '../../src/types/tradier/calendar';
import { MarketTime, marketTimeToMenuKey } from '../../src/types/MarketTime';
import { render, screen, waitFor, within } from '@testing-library/react';
import {
	type AggregateInvestmentData,
	useGetAggregateInvestmentData
} from '../../src/queries/InvestmentAggregateQueries';
import { Provider } from 'react-redux';
import { createStore, type StoreType } from '../../src/store/createStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	expectedVtiData,
	expectedVxusData,
	vtiHistory,
	vtiQuote,
	vxusHistory,
	vxusQuote
} from '../testutils/support/aggregate-queries/data';
import type { TradierHistory } from '../../src/types/tradier/history';
import type { InvestmentData } from '../../src/types/data/InvestmentData';

const DATE_FORMAT = 'yyyy-MM-dd';
const queryClient = new QueryClient();

const createTradierCalendarHandler = (
	status: TradierCalendarStatus
): HttpHandler =>
	http.get(
		'http://localhost:3000/market-tracker/api/tradier/markets/calendar',
		() => {
			const today = new Date();
			const calendar: TradierCalendar = {
				calendar: {
					days: {
						day: [
							{
								date: format(today, DATE_FORMAT),
								status
							}
						]
					},
					month: getMonth(today) + 1,
					year: getYear(today)
				}
			};
			return HttpResponse.json(calendar);
		}
	);

const tradierHistoryHandler: HttpHandler = http.get<
	PathParams,
	DefaultBodyType,
	TradierHistory | string
>(
	'http://localhost:3000/market-tracker/api/tradier/markets/history',
	({ request }) => {
		const url = new URL(request.url);
		const symbol = url.searchParams.get('symbol');
		if (symbol === 'VTI') {
			return HttpResponse.json(vtiHistory);
		}

		if (symbol === 'VXUS') {
			return HttpResponse.json(vxusHistory);
		}

		return HttpResponse.text(`Invalid symbol: ${symbol}`, {
			status: 400
		});
	}
);

const tradierQuoteHandler: HttpHandler = http.get(
	'http://localhost:3000/market-tracker/api/tradier/markets/quotes',
	({ request }) => {
		const url = new URL(request.url);
		const symbols = url.searchParams.get('symbols')?.split(',') ?? [];
		const quotes = [
			symbols.includes('VTI') ? vtiQuote : undefined,
			symbols.includes('VXUS') ? vxusQuote : undefined
		].filter((quote): quote is TradierQuote => !!quote);

		if (quotes.length === 0) {
			return HttpResponse.json<TradierQuotes>({
				quotes: {
					quote: undefined,
					unmatched_symbols: undefined
				}
			});
		}

		if (quotes.length === 0) {
			return HttpResponse.json<TradierQuotes>({
				quotes: {
					quote: quotes[0],
					unmatched_symbols: undefined
				}
			});
		}

		return HttpResponse.json<TradierQuotes>({
			quotes: {
				quote: quotes,
				unmatched_symbols: undefined
			}
		});
	}
);

type StockDataComponentProps = Readonly<{
	symbol: string;
	data?: AggregateInvestmentData;
}>;
const StockDataComponent = ({ symbol, data }: StockDataComponentProps) => (
	<div data-testid={`${symbol}-data`}>
		<p>VTI</p>
		<p>Name: {data?.[symbol]?.name}</p>
		<p>Start Price: {data?.[symbol]?.startPrice}</p>
		<p>Current Price: {data?.[symbol]?.currentPrice}</p>
		{(data?.[symbol]?.history?.length ?? 0) > 0 && (
			<>
				<p>History:</p>
				<ul>
					{data?.[symbol]?.history?.map((record, index) => (
						<li key={index}>
							History Record: {record.date} {record.time}:{' '}
							{record.price}
						</li>
					))}
				</ul>
			</>
		)}
	</div>
);

const QueryValidationComponent = () => {
	const { data, isLoading, error } = useGetAggregateInvestmentData([
		'VTI',
		'VXUS'
	]);
	return (
		<div>
			<p>Is Loading: {`${isLoading}`}</p>
			<p>Has Error: {`${error !== null}`}</p>
			<StockDataComponent symbol="VTI" data={data} />
			<StockDataComponent symbol="VXUS" data={data} />
		</div>
	);
};

type RootComponentProps = Readonly<{
	store: StoreType;
}>;
const RootComponent = ({ store }: RootComponentProps) => {
	return (
		<div>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<QueryValidationComponent />
				</QueryClientProvider>
			</Provider>
		</div>
	);
};

const validateData = (
	root: HTMLElement,
	time: MarketTime,
	expectedData: InvestmentData
) => {
	expect(within(root).getByText(/Name:/)).toHaveTextContent(
		`Name: ${expectedData.name}`
	);

	if (MarketTime.ONE_DAY === time) {
		expect(within(root).getByText(/Start Price:/)).toHaveTextContent(
			`Start Price: ${expectedData.startPrice}`
		);
	} else {
		expect(within(root).getByText(/Start Price:/)).toHaveTextContent(
			`Start Price: ${expectedData.history[0].price}`
		);
	}

	expect(within(root).getByText(/Current Price:/)).toHaveTextContent(
		`Current Price: ${expectedData.currentPrice}`
	);

	if (MarketTime.ONE_DAY === time) {
		expect(within(root).queryByText('History:')).not.toBeInTheDocument();
	} else {
		expect(within(root).queryByText('History:')).toBeVisible();

		const recordElements = within(root).getAllByText(/History Record:/);
		expect(recordElements).toHaveLength(expectedData.history.length);
	}
};

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateInvestmentData',
	async (time) => {
		server.server.resetHandlers(
			tradierQuoteHandler,
			tradierHistoryHandler,
			createTradierCalendarHandler(
				time === MarketTime.ONE_DAY ? 'closed' : 'open'
			)
		);

		const store = createStore({
			marketSettings: {
				time: {
					menuKey: marketTimeToMenuKey(time),
					value: time
				}
			}
		});

		render(<RootComponent store={store} />);
		await waitFor(() =>
			expect(screen.getByText(/Is Loading/)).toHaveTextContent(
				'Is Loading: false'
			)
		);
		expect(screen.getByText('Has Error: false')).toBeVisible();

		const vtiData = screen.getByTestId('VTI-data');
		validateData(vtiData, time, expectedVtiData);

		const vxusData = screen.getByTestId('VXUS-data');
		validateData(vxusData, time, expectedVxusData);
	}
);
