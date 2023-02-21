import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
	MarketTime,
	marketTimeToMenuKey,
	menuKeyToMarketTime
} from '../../types/MarketTime';

interface StateType {
	readonly time: {
		readonly menuKey: string;
		readonly value: MarketTime;
	};
}

const initialState: StateType = {
	time: {
		menuKey: marketTimeToMenuKey(MarketTime.ONE_DAY),
		value: MarketTime.ONE_DAY
	}
};

const setTime = (draft: Draft<StateType>, action: PayloadAction<string>) => {
	draft.time = {
		menuKey: action.payload,
		value: menuKeyToMarketTime(action.payload)
	};
};

const reset = (draft: Draft<StateType>) => {
	draft.time = initialState.time;
};

export const marketSettingsSlice = createSlice({
	name: 'time',
	initialState,
	reducers: {
		setTime,
		reset
	}
});
