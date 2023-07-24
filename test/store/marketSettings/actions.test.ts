import { changeSelectedTime } from '../../../src/store/marketSettings/actions';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from '../../testutils/mockStoreUtils';
import { MarketTime, marketTimeToMenuKey } from '../../../src/types/MarketTime';
import { RootState, StoreType } from '../../../src/store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import produce from 'immer';
import { marketSettingsSlice } from '../../../src/store/marketSettings/slice';
import { marketTrackerApiFpTs } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import * as Time from '@craigmiller160/ts-functions/Time';
import { TradierCalendar } from '../../../src/types/tradier/calendar';

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

const newMockStore = createMockStore<RootState, DispatchExts>([thunk]);
const todayKey = marketTimeToMenuKey(MarketTime.ONE_DAY);
const oneWeekKey = marketTimeToMenuKey(MarketTime.ONE_WEEK);
const mockApi = new MockAdapter(marketTrackerApiFpTs.instance);
const formatCalendarYear = Time.format('yyyy');
const formatCalendarMonth = Time.format('MM');
const formatDate = Time.format('yyyy-MM-dd');

const date = new Date();
const formattedDate = formatDate(date);
const month = formatCalendarMonth(date);
const year = formatCalendarYear(date);

const tradierCalendar: TradierCalendar = {
	calendar: {
		month: 1,
		year: 2,
		days: {
			day: [
				{
					date: formattedDate,
					status: 'closed'
				}
			]
		}
	}
};

type MockStoreType = StoreType & MockStoreEnhanced;

describe('marketSettings actions', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	describe('changeSelectedTime', () => {
		it('current & new time match', async () => {
			const mockStore = newMockStore(defaultState) as MockStoreType;
			await mockStore.dispatch(changeSelectedTime(todayKey));

			expect(mockStore.getActions()).toEqual([]);
		});

		it('changes time and checks market status for Today', async () => {
			mockApi
				.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
				.reply(200, tradierCalendar);
			const newDefaultState = produce(defaultState, (draft) => {
				draft.marketSettings.time.value = MarketTime.FIVE_YEARS;
			});
			const mockStore = newMockStore(newDefaultState) as MockStoreType;
			await mockStore.dispatch(changeSelectedTime(todayKey));

			expect(mockStore.getActions()).toEqual([
				{
					type: marketSettingsSlice.actions.setTime.type,
					payload: todayKey
				}
			]);
		});

		it('changes time and checks market status for other time', async () => {
			const newDefaultState = produce(defaultState, (draft) => {
				draft.marketSettings.time.value = MarketTime.FIVE_YEARS;
			});
			const mockStore = newMockStore(newDefaultState) as MockStoreType;
			await mockStore.dispatch(changeSelectedTime(oneWeekKey));

			expect(mockStore.getActions()).toEqual([
				{
					type: marketSettingsSlice.actions.setTime.type,
					payload: oneWeekKey
				}
			]);
		});
	});
});
