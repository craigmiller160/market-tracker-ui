import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../src/store';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from '../../testutils/mockStoreUtils';
import { MarketTime } from '../../../src/types/MarketTime';
import { render } from '@testing-library/react';
import { useCheckMarketStatus } from '../../../src/components/Content/useCheckMarketStatus';
import { Provider } from 'react-redux';
import produce from 'immer';
import { AuthUser } from '../../../src/types/auth';
import * as Option from 'fp-ts/es6/Option';

jest.mock('../../../src/store/marketSettings/actions', () => ({
	checkAndUpdateMarketStatus: (time: MarketTime) => ({
		type: 'checkAndUpdateMarketStatus',
		payload: time
	})
}));

const userData: AuthUser = {
	userId: 1
};

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
		const newState = produce(defaultState, (draft) => {
			draft.auth.hasChecked = true;
			draft.auth.userData = Option.some(userData);
		});
		const mockStore = newMockStore(newState);
		doRender(mockStore);
		expect(mockStore.getActions()).toEqual([
			{
				type: 'checkAndUpdateMarketStatus',
				payload: MarketTime.ONE_DAY
			}
		]);
	});

	it('tries to run more than once', () => {
		throw new Error();
	});
});
