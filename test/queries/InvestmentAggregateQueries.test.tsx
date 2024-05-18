import { test, expect } from 'vitest';
import { server } from '../testutils/msw-server';
import type {
	TradierQuote,
	TradierQuotes
} from '../../src/types/tradier/quotes';
import { http, type HttpHandler, HttpResponse } from 'msw';
import { format, getMonth, getYear } from 'date-fns';
import type {
	TradierCalendar,
	TradierCalendarStatus
} from '../../src/types/tradier/calendar';
import { MarketTime } from '../../src/types/MarketTime';
import { render, screen } from '@testing-library/react';
import {
	type AggregateInvestmentData,
	useGetAggregateInvestmentData
} from '../../src/queries/InvestmentAggregateQueries';

const DATE_FORMAT = 'yyyy-MM-dd';

const vtiQuote: TradierQuote = {
	symbol: 'VTI',
	description: '',
	ask: 0,
	bid: 0,
	close: 0,
	high: 0,
	last: 262.3,
	low: 0,
	open: 0,
	prevclose: 261.93
};

const vxusQuote: TradierQuote = {
	symbol: 'VXUS',
	description: '',
	ask: 0,
	bid: 0,
	close: 0,
	high: 0,
	last: 62.21,
	low: 0,
	open: 0,
	prevclose: 61.94
};

const createTradierCalendarHandler = (
	status: TradierCalendarStatus
): HttpHandler =>
	http.get(
		'http://localhost:3000/market-tracker/api/tradier/marekts/calendar',
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
							{record.date} {record.time}: {record.price}
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
			<p>Is Loading: {isLoading}</p>
			<p>Has Error: {error !== null}</p>
			<StockDataComponent symbol="VTI" data={data} />
			<StockDataComponent symbol="VXUS" data={data} />
		</div>
	);
};

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateInvestmentData',
	(time) => {
		if (time === MarketTime.ONE_WEEK) {
			throw new Error('Not implemented yet');
		}

		server.server.resetHandlers(
			tradierQuoteHandler,
			createTradierCalendarHandler(
				time === MarketTime.ONE_DAY ? 'closed' : 'open'
			)
		);

		render(<QueryValidationComponent />);
		expect(screen.getByText('Hello World')).toBeVisible();
	}
);
