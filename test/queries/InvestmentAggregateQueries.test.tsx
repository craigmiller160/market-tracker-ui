import { expect, test } from 'vitest';
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
	expectedVxusData
} from '../testutils/support/aggregate-queries/data';
import type { InvestmentData } from '../../src/types/data/InvestmentData';
import { prepareAggregateQueryMswHandlers } from '../testutils/support/aggregate-queries/msw-handlers';

const queryClient = new QueryClient();

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

		expectedData.history.forEach((expectedRecord, index) => {
			const actualElement = recordElements[index];
			expect(actualElement).toHaveTextContent(
				`History Record: ${expectedRecord.date} ${expectedRecord.time}: ${expectedRecord.price}`
			);
		});
	}
};

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validates useGetAggregateInvestmentData',
	async (time) => {
		prepareAggregateQueryMswHandlers(time);

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
