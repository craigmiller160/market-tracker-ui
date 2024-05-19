import {
	type DefaultBodyType,
	http,
	type HttpHandler,
	HttpResponse
} from 'msw';
import type { SharesOwnedResponse } from '../../../../src/types/generated/market-tracker-portfolio-service';
import {
	vtiCurrent,
	vtiOneWeekHistory,
	vtiTodayHistory,
	vxusCurrent,
	vxusOneWeekHistory,
	vxusTodayHistory
} from './portfolio-data';
import { server } from '../../msw-server';
import { match } from 'ts-pattern';
import type { StockHistoryInterval } from '../../../../src/types/portfolios';

type PortfolioStockParams = Readonly<{
	portfolioId: string;
	stockSymbol: string;
}>;
const portfolioStockCurrentHandler: HttpHandler = http.get<
	PortfolioStockParams,
	DefaultBodyType,
	SharesOwnedResponse | string
>(
	'http://localhost:3000/market-tracker/portfolios/portfolios/:portfolioId/stocks/:stockSymbol/current',
	({ params }) => {
		if (params.stockSymbol === 'VTI') {
			return HttpResponse.json(vtiCurrent);
		}

		if (params.stockSymbol === 'VXUS') {
			return HttpResponse.json(vxusCurrent);
		}

		return HttpResponse.text(
			`Invalid stock symbol: ${params.stockSymbol}`,
			{
				status: 400
			}
		);
	}
);

type HistoryMatch = Readonly<{
	symbol: string;
	interval: StockHistoryInterval;
}>;
const portfolioStockHistoryHandler: HttpHandler = http.get<
	PortfolioStockParams,
	DefaultBodyType,
	ReadonlyArray<SharesOwnedResponse> | string
>(
	'http://localhost:3000/market-tracker/portfolios/portfolios/:portfolioId/stocks/:stockSymbol/history',
	({ params, request }) => {
		const url = new URL(request.url);
		const interval = url.searchParams.get(
			'interval'
		) as StockHistoryInterval;

		const response = match<
			HistoryMatch,
			ReadonlyArray<SharesOwnedResponse> | string
		>({ symbol: params.stockSymbol, interval })
			.with({ symbol: 'VTI', interval: 'SINGLE' }, () => vtiTodayHistory)
			.with({ symbol: 'VTI', interval: 'DAILY' }, () => vtiOneWeekHistory)
			.with(
				{ symbol: 'VXUS', interval: 'SINGLE' },
				() => vxusTodayHistory
			)
			.with(
				{ symbol: 'VXUS', interval: 'DAILY' },
				() => vxusOneWeekHistory
			)
			.otherwise(() => 'Invalid request parameters');

		if (response instanceof Array) {
			return HttpResponse.json(response);
		}

		return HttpResponse.text(response, {
			status: 400
		});
	}
);

export const prepareAggregateQueryMswHandlers = () =>
	server.server.resetHandlers(
		portfolioStockCurrentHandler,
		portfolioStockHistoryHandler
	);
