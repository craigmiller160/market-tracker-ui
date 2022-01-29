import { MenuItemTimeKey } from '../../components/Navbar/MenuItemKey';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import * as Text from '@craigmiller160/ts-functions/es/Text';

interface StateType {
	readonly menuKey: MenuItemTimeKey;
	readonly value: string;
}

const initialState: StateType = {
	menuKey: 'time.oneDay',
	value: 'oneDay'
};

const setTime = (
	draft: Draft<StateType>,
	action: PayloadAction<MenuItemTimeKey>
) => {
	draft.menuKey = action.payload;
	draft.value = Text.split('.')(action.payload)[1];
};

export const timeSlice = createSlice({
	name: 'time',
	initialState,
	reducers: {
		setTime
	}
});
