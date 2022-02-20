import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
	MarketTime,
	marketTimeToMenuKey,
	menuKeyToMarketTime
} from '../../types/MarketTime';
import { MarketStatus } from '../../types/MarketStatus';

interface StateType {
	readonly time: {
		readonly menuKey: string;
		readonly value: MarketTime;
	};
	readonly status: MarketStatus;
}

const initialState: StateType = {
	time: {
		menuKey: marketTimeToMenuKey(MarketTime.ONE_DAY),
		value: MarketTime.ONE_DAY
	},
	status: MarketStatus.UNKNOWN
};

const setTime = (draft: Draft<StateType>, action: PayloadAction<string>) => {
	draft.time = {
		menuKey: action.payload,
		value: menuKeyToMarketTime(action.payload)
	};
	draft.status = MarketStatus.UNKNOWN;
};

const setStatus = (
	draft: Draft<StateType>,
	action: PayloadAction<MarketStatus>
) => {
	draft.status = action.payload;
};

const reset = (draft: Draft<StateType>) => {
	draft.time = initialState.time;
	draft.status = initialState.status;
};

export const marketSettingsSlice = createSlice({
	name: 'time',
	initialState,
	reducers: {
		setTime,
		reset,
		setStatus
	}
});
