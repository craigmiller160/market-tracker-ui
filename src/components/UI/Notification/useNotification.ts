import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { notificationsSelector } from '../../../store/notification/selectors';
import { notification as antNotification } from 'antd';
import {
	Notification,
	notificationSlice
} from '../../../store/notification/slice';
import { useCallback, useEffect } from 'react';
import { Dispatch } from 'redux';

const useHandleShowingNotifications = (dispatch: Dispatch) =>
	useCallback(
		(notifications: ReadonlyArray<Notification>) =>
			notifications.forEach((notification) => {
				if (!notification.isShown) {
					antNotification[notification.type]({
						message: notification.message,
						description: notification.description,
						duration: 6,
						onClose: () => {
							dispatch(
								notificationSlice.actions.hide(notification.id)
							);
						}
					});
					dispatch(
						notificationSlice.actions.markShown(notification.id)
					);
				}
			}),
		[dispatch]
	);

antNotification.config({
	maxCount: 10
});

export const useNotification = () => {
	const dispatch = useDispatch();
	const notifications = useSelector(notificationsSelector, shallowEqual);
	const handleShowingNotifications = useHandleShowingNotifications(dispatch);

	useEffect(() => {
		handleShowingNotifications(notifications);
	}, [notifications.length]); // eslint-disable-line react-hooks/exhaustive-deps
};
