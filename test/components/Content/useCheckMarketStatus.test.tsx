import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../src/store';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from '../../testutils/mockStoreUtils';
import { MarketTime } from '../../../src/types/MarketTime';
import { render } from '@testing-library/react';
import { useCheckMarketStatus } from '../../../src/components/Content/useCheckMarketStatus';
import { Provider } from 'react-redux';

jest.mock('../../../src/store/marketSettings/actions', () => ({
	checkAndUpdateMarketStatus: (time: MarketTime) => ({
		type: 'checkAndUpdateMarketStatus',
		payload: time
	})
}));

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

const newMockStore = createMockStore<RootState, DispatchExts>([thunk]);

const MockComponent = () => {
	useCheckMarketStatus();
	return <div />;
};

const doRender = (store: MockStoreEnhanced) =>
	render(
		<Provider store={store}>
			<MockComponent />
		</Provider>
	);

describe('useCheckMarketStatus', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('user is not authorized', () => {
		const mockStore = newMockStore(defaultState);
		doRender(mockStore);
		expect(mockStore.getActions()).toEqual([]);
	});

	it('runs successfully a single time', () => {
		throw new Error();
	});

	it('tries to run more than once', () => {
		throw new Error();
	});
});
