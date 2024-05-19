import {
	type DefaultBodyType,
	http,
	type HttpHandler,
	HttpResponse,
	type PathParams
} from 'msw';
import type { SharesOwnedResponse } from '../../../../src/types/generated/market-tracker-portfolio-service';
import { vtiCurrent, vxusCurrent } from './portfolio-data';
import { server } from '../../msw-server';

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

export const prepareAggregateQueryMswHandlers = () =>
	server.server.resetHandlers(portfolioStockCurrentHandler);
