import { createSlice, Draft, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { match } from 'ts-pattern';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
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

// TODO move to functions lib if it works
const dropFirstMatch =
	<T>(predicate: PredicateT<T>) =>
	(arr: ReadonlyArray<T>): ReadonlyArray<T> => {
		const index = arr.findIndex(predicate);
		return arr.slice(0, index).concat(arr.slice(index + 1));
	};

const hide = (draft: Draft<StateType>, action: PayloadAction<string>) => {
	const notifications = dropFirstMatch<Notification>(
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
