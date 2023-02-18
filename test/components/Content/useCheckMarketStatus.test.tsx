import { AnyAction, nanoid, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../src/store';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from '../../testutils/mockStoreUtils';
import { MarketTime } from '../../../src/types/MarketTime';
import { render, screen } from '@testing-library/react';
import { useCheckMarketStatus } from '../../../src/components/Content/useCheckMarketStatus';
import { Provider } from 'react-redux';
import produce from 'immer';
import { AuthUser } from '../../../src/types/auth';
import * as Option from 'fp-ts/es6/Option';
import { useImmer } from 'use-immer';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

jest.mock('../../../src/store/marketSettings/actions', () => ({
	checkAndUpdateMarketStatus: (time: MarketTime) => ({
		type: 'checkAndUpdateMarketStatus',
		payload: time
	})
}));

const userData: AuthUser = {
	userId: nanoid()
};

interface MockState {
	readonly name: string;
}

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

const newMockStore = createMockStore<RootState, DispatchExts>([thunk]);

const MockComponent = () => {
	const [state, setState] = useImmer<MockState>({
		name: 'Bob'
	});
	useCheckMarketStatus();

	const changeName = () =>
		setState((draft) => {
			draft.name = 'Joe';
		});

	return (
		<div>
			<p>Name: {state.name}</p>
			<button onClick={changeName}>Click</button>
		</div>
	);
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
		expect(screen.queryByText('Name: Bob')).toBeInTheDocument();
		expect(mockStore.getActions()).toEqual([]);
	});

	it('runs successfully a single time', () => {
		const newState = produce(defaultState, (draft) => {
			draft.auth.hasChecked = true;
			draft.auth.userData = Option.some(userData);
		});
		const mockStore = newMockStore(newState);
		doRender(mockStore);
		expect(screen.queryByText('Name: Bob')).toBeInTheDocument();
		expect(mockStore.getActions()).toEqual([
			{
				type: 'checkAndUpdateMarketStatus',
				payload: MarketTime.ONE_DAY
			}
		]);
	});

	it('Invoked by a component re-render after already having run', async () => {
		const newState = produce(defaultState, (draft) => {
			draft.auth.hasChecked = true;
			draft.auth.userData = Option.some(userData);
		});
		const mockStore = newMockStore(newState);
		doRender(mockStore);
		expect(screen.queryByText(/Name: .*/)).toHaveTextContent('Name: Bob');

		await userEvent.click(screen.getByText('Click'));
		expect(screen.queryByText(/Name: .*/)).toHaveTextContent('Name: Joe');

		expect(mockStore.getActions()).toEqual([
			{
				type: 'checkAndUpdateMarketStatus',
				payload: MarketTime.ONE_DAY
			}
		]);
	});
});
