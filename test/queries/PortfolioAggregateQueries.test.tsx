import { test } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { MarketTime } from '../../src/types/MarketTime';

const queryClient = new QueryClient();

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateCurrentSharesForStocksInPortfolio',
	(time) => {
		throw new Error();
	}
);

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateSharesHistoryForStocksInPortfolio',
	(time) => {
		throw new Error();
	}
);
