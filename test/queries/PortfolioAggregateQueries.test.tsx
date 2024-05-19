import { expect, test } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketTime, marketTimeToMenuKey } from '../../src/types/MarketTime';
import { prepareAggregateQueryMswHandlers } from '../testutils/support/aggregate-queries/portfolio-msw-handlers';
import { createStore, type StoreType } from '../../src/store/createStore';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { useGetAggregateCurrentSharesForStocksInPortfolio } from '../../src/queries/PortfolioAggregateQueries';

const queryClient = new QueryClient();

const CurrentSharesComponent = () => {
	const { data, isLoading, error } =
		useGetAggregateCurrentSharesForStocksInPortfolio('id', ['VTI', 'VXUS']);

	return (
		<div>
			<p>Is Loading: {`${isLoading}`}</p>
			<p>Has Error: {`${error !== null}`}</p>
		</div>
	);
};

type RootComponentProps = Readonly<{
	store: StoreType;
}>;
const RootComponent = ({
	store,
	children
}: PropsWithChildren<RootComponentProps>) => (
	<div>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</Provider>
	</div>
);

test('validates useGetAggregateCurrentSharesForStocksInPortfolio', async () => {
	prepareAggregateQueryMswHandlers();
	const store = createStore();

	render(
		<RootComponent store={store}>
			<CurrentSharesComponent />
		</RootComponent>
	);
	await waitFor(() =>
		expect(screen.getByText(/Is Loading/)).toHaveTextContent(
			'Is Loading: false'
		)
	);
	expect(screen.getByText('Has Error: false')).toBeVisible();
});

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateSharesHistoryForStocksInPortfolio',
	(time) => {
		prepareAggregateQueryMswHandlers();
		const store = createStore({
			marketSettings: {
				time: {
					menuKey: marketTimeToMenuKey(time),
					value: time
				}
			}
		});
		throw new Error();
	}
);
