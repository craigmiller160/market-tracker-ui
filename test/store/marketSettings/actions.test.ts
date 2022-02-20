import { changeSelectedTime } from '../../../src/store/marketSettings/actions';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from '../../testutils/mockStoreUtils';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';
import { RootState } from '../../../src/store';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import produce from 'immer';
import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import { MarketStatus } from '../../../src/types/MarketStatus';

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

const newMockStore = createMockStore<RootState, DispatchExts>([thunk]);
const todayKey = marketTimeToMenuKey(MarketTime.ONE_DAY);
const oneWeekKey = marketTimeToMenuKey(MarketTime.ONE_WEEK);

describe('marketSettings actions', () => {
	describe('changeSelectedTime', () => {
		it('current & new time match', async () => {
			const mockStore = newMockStore(defaultState);
			await mockStore.dispatch(changeSelectedTime(todayKey));

			expect(mockStore.getActions()).toEqual([]);
		});

		it('checks market status for Today', async () => {
			const newDefaultState = produce(defaultState, (draft) => {
				draft.marketSettings.time.value = MarketTime.FIVE_YEARS;
			});
			const mockStore = newMockStore(newDefaultState);
			await mockStore.dispatch(changeSelectedTime(todayKey));

			expect(mockStore.getActions()).toEqual([
				{
					type: marketSettingsSlice.actions.setTime,
					payload: todayKey
				},
				{
					type: marketSettingsSlice.actions.setStatus,
					payload: MarketStatus.CLOSED
				}
			]);
		});

		it('checks market status for other time', async () => {
			const newDefaultState = produce(defaultState, (draft) => {
				draft.marketSettings.time.value = MarketTime.FIVE_YEARS;
			});
			const mockStore = newMockStore(newDefaultState);
			await mockStore.dispatch(changeSelectedTime(oneWeekKey));

			expect(mockStore.getActions()).toEqual([
				{
					type: marketSettingsSlice.actions.setTime.type,
					payload: oneWeekKey
				},
				{
					type: marketSettingsSlice.actions.setStatus.type,
					payload: MarketStatus.OPEN
				}
			]);
		});
	});
});
