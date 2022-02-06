import { createSlice, Draft, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { match } from 'ts-pattern';
import * as RArrayExt from '@craigmiller160/ts-functions/es/ReadonlyArrayExt';
import { castDraft } from 'immer';

// TODO if this works, delete all the Alert stuff
// TODO write tests for this

type NotificationType = 'success' | 'error';

interface Notification {
	readonly id: string;
	readonly type: NotificationType;
	readonly message: string;
	readonly description: string;
}

interface StateType {
	readonly notifications: ReadonlyArray<Notification>;
}

const initialState: StateType = {
	notifications: []
};

const getMessage = (type: NotificationType) =>
	match(type)
		.with('success', () => 'Success')
		.with('error', () => 'Error')
		.run();

const addNotification = (
	draft: Draft<StateType>,
	type: NotificationType,
	description: string
) => {
	draft.notifications = [
		...draft.notifications,
		{
			id: nanoid(),
			type,
			message: getMessage(type),
			description
		}
	];
};

const showSuccess = (
	draft: Draft<StateType>,
	action: PayloadAction<string>
) => {
	addNotification(draft, 'success', action.payload);
};

const showError = (draft: Draft<StateType>, action: PayloadAction<string>) => {
	addNotification(draft, 'error', action.payload);
};

const hide = (draft: Draft<StateType>, action: PayloadAction<string>) => {
	const notifications = RArrayExt.dropFirstMatch<Notification>(
		(_) => _.id === action.payload
	)(draft.notifications);
	draft.notifications = castDraft(notifications);
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		showSuccess,
		showError,
		hide
	}
});
