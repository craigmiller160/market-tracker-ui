import {
    createSlice,
    type Draft,
    nanoid,
    type PayloadAction
} from '@reduxjs/toolkit';
import { match } from 'ts-pattern';
import * as RArrayExt from '@craigmiller160/ts-functions/ReadonlyArrayExt';
import { castDraft } from 'immer';

export type NotificationType = 'success' | 'error';

export interface Notification {
    readonly id: string;
    readonly isShown: boolean;
    readonly type: NotificationType;
    readonly message: string;
    readonly description: string;
}

export interface StateType {
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
            isShown: false,
            type,
            message: getMessage(type),
            description
        }
    ];
};

const addSuccess = (draft: Draft<StateType>, action: PayloadAction<string>) => {
    addNotification(draft, 'success', action.payload);
};

const addError = (draft: Draft<StateType>, action: PayloadAction<string>) => {
    addNotification(draft, 'error', action.payload);
};

const markShown = (draft: Draft<StateType>, action: PayloadAction<string>) => {
    const notifications = RArrayExt.updateFirstMatch<Notification>(
        (_) => _.id === action.payload,
        (_) => ({
            ..._,
            isShown: true
        })
    )(draft.notifications);
    draft.notifications = castDraft(notifications);
};

const hide = (draft: Draft<StateType>, action: PayloadAction<string>) => {
    const notifications = RArrayExt.dropFirstMatch<Notification>(
        (_) => _.id === action.payload
    )(draft.notifications);
    draft.notifications = castDraft(notifications);
};

const reset = (draft: Draft<StateType>) => {
    draft.notifications = [];
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addSuccess,
        addError,
        hide,
        markShown,
        reset
    }
});
