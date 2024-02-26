import { type RootState } from '../index';

export const notificationsSelector = (state: RootState) =>
	state.notification.notifications;
