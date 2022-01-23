import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Draft } from '@reduxjs/toolkit';

type AlertType = 'success' | 'error';

interface StateType {
	readonly show: boolean;
	readonly type: AlertType;
	readonly message: string;
}

export const initialState: StateType = {
	show: false,
	type: 'success',
	message: ''
};

export const showSuccess = (
	draft: Draft<StateType>,
	action: PayloadAction<string>
) => {
	draft.show = true;
	draft.type = 'success';
	draft.message = action.payload;
};

export const showError = (
	draft: Draft<StateType>,
	action: PayloadAction<string>
) => {
	draft.show = true;
	draft.type = 'error';
	draft.message = action.payload;
};

export const hide = (draft: Draft<StateType>) => {
	draft.show = false;
};

export const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		showSuccess,
		showError,
		hide
	}
});
