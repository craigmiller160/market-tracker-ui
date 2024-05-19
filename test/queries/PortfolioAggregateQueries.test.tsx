import { test } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketTime, marketTimeToMenuKey } from '../../src/types/MarketTime';
import { prepareAggregateQueryMswHandlers } from '../testutils/support/aggregate-queries/portfolio-msw-handlers';
import { createStore, type StoreType } from '../../src/store/createStore';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

const queryClient = new QueryClient();

const QueryValidationComponent = () => <div />;

type RootComponentProps = Readonly<{
	store: StoreType;
}>;
const RootComponent = ({ store }: RootComponentProps) => (
	<div>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<QueryValidationComponent />
			</QueryClientProvider>
		</Provider>
	</div>
);

test('validates useGetAggregateCurrentSharesForStocksInPortfolio', () => {
	prepareAggregateQueryMswHandlers();
	const store = createStore();
	render(<RootComponent store={store} />);
	throw new Error();
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
		render(<RootComponent store={store} />);
		throw new Error();
	}
);
