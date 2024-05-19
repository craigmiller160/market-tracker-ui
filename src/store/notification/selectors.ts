import { type RootState } from '../createStore';

export const notificationsSelector = (state: RootState) =>
	state.notification.notifications;
