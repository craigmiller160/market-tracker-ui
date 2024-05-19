import { expect, test } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketTime, marketTimeToMenuKey } from '../../src/types/MarketTime';
import { prepareAggregateQueryMswHandlers } from '../testutils/support/aggregate-queries/portfolio-msw-handlers';
import { createStore, type StoreType } from '../../src/store/createStore';
import { Provider, useSelector } from 'react-redux';
import { render, screen, waitFor, within } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import {
	useGetAggregateCurrentSharesForStocksInPortfolio,
	useGetAggregateSharesHistoryForStocksInPortfolio
} from '../../src/queries/PortfolioAggregateQueries';
import {
	vtiCurrent,
	vtiOneWeekHistory,
	vtiTodayHistory,
	vxusCurrent,
	vxusOneWeekHistory,
	vxusTodayHistory
} from '../testutils/support/aggregate-queries/portfolio-data';
import { timeValueSelector } from '../../src/store/marketSettings/selectors';
import type { SharesOwnedResponse } from '../../src/types/generated/market-tracker-portfolio-service';

const queryClient = new QueryClient();

const AggregateCurrentSharesComponent = () => {
	const { data, isLoading, error } =
		useGetAggregateCurrentSharesForStocksInPortfolio('id', ['VTI', 'VXUS']);

	return (
		<div>
			<p>Is Loading: {`${isLoading}`}</p>
			<p>Has Error: {`${error !== null}`}</p>
			<p>
				VTI: {data?.VTI?.date} {data?.VTI?.totalShares}
			</p>
			<p>
				VXUS: {data?.VXUS?.date} {data?.VXUS?.totalShares}
			</p>
		</div>
	);
};

type HistoryProps = Readonly<{
	symbol: string;
	history: ReadonlyArray<SharesOwnedResponse>;
}>;
const HistoryComponent = ({ symbol, history }: HistoryProps) => (
	<div data-testid={`${symbol}-data`}>
		{history.map((record) => (
			<p key={record.date}>
				History: {record.date} {record.totalShares}
			</p>
		))}
	</div>
);

const AggregateHistoryComponent = () => {
	const time = useSelector(timeValueSelector);
	const { data, isLoading, error } =
		useGetAggregateSharesHistoryForStocksInPortfolio(
			'id',
			['VTI', 'VXUS'],
			time
		);
	return (
		<div>
			<p>Is Loading: {`${isLoading}`}</p>
			<p>Has Error: {`${error !== null}`}</p>
			<HistoryComponent symbol="VTI" history={data?.VTI ?? []} />
			<HistoryComponent symbol="VXUS" history={data?.VXUS ?? []} />
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
			<AggregateCurrentSharesComponent />
		</RootComponent>
	);
	await waitFor(() =>
		expect(screen.getByText(/Is Loading/)).toHaveTextContent(
			'Is Loading: false'
		)
	);
	expect(screen.getByText('Has Error: false')).toBeVisible();

	expect(screen.getByText(/VTI:/)).toHaveTextContent(
		`VTI: ${vtiCurrent.date} ${vtiCurrent.totalShares}`
	);

	expect(screen.getByText(/VXUS:/)).toHaveTextContent(
		`VXUS: ${vxusCurrent.date} ${vxusCurrent.totalShares}`
	);
});

const validateHistory = (
	root: HTMLElement,
	expectedHistory: ReadonlyArray<SharesOwnedResponse>
) => {
	const elements = within(root).getAllByText(/History:/);
	expect(elements).toHaveLength(expectedHistory.length);

	expectedHistory.forEach((expectedRecord, index) => {
		const actualElement = elements[index];
		expect(actualElement).toHaveTextContent(
			`History: ${expectedRecord.date} ${expectedRecord.totalShares}`
		);
	});
};

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateSharesHistoryForStocksInPortfolio %s',
	async (time) => {
		prepareAggregateQueryMswHandlers();
		const store = createStore({
			marketSettings: {
				time: {
					menuKey: marketTimeToMenuKey(time),
					value: time
				}
			}
		});

		render(
			<RootComponent store={store}>
				<AggregateHistoryComponent />
			</RootComponent>
		);
		await waitFor(() =>
			expect(screen.getByText(/Is Loading/)).toHaveTextContent(
				'Is Loading: false'
			)
		);
		expect(screen.getByText('Has Error: false')).toBeVisible();

		const vtiHistory = screen.getByTestId('VTI-data');
		validateHistory(
			vtiHistory,
			time === MarketTime.ONE_DAY ? vtiTodayHistory : vtiOneWeekHistory
		);
		const vxusHistory = screen.getByTestId('VXUS-data');
		validateHistory(
			vxusHistory,
			time === MarketTime.ONE_DAY ? vxusTodayHistory : vxusOneWeekHistory
		);
	}
);
