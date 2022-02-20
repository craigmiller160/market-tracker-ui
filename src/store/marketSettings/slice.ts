import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
	MarketTime,
	marketTimeToMenuKey,
	menuKeyToMarketTime
} from '../../types/MarketTime';

interface StateType {
	readonly menuKey: string;
	readonly value: MarketTime;
}

const initialState: StateType = {
	menuKey: marketTimeToMenuKey(MarketTime.ONE_DAY),
	value: MarketTime.ONE_DAY
};

const setTime = (draft: Draft<StateType>, action: PayloadAction<string>) => {
	draft.menuKey = action.payload;
	draft.value = menuKeyToMarketTime(action.payload);
};

const reset = (draft: Draft<StateType>) => {
	draft.menuKey = initialState.menuKey;
	draft.value = initialState.value;
};

export const marketSettingsSlice = createSlice({
	name: 'time',
	initialState,
	reducers: {
		setTime,
		reset
	}
});
