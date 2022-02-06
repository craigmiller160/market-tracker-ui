import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { alertSelector } from '../../../store/alert/selectors';
import { match } from 'ts-pattern';
import { useEffect } from 'react';
import { alertSlice } from '../../../store/alert/slice';
import { notification as antNotification } from 'antd';
import { notificationSlice } from '../../../store/notification/slice';
import { notificationsSelector } from '../../../store/notification/selectors';

// TODO delete this

export const Temp = () => {
	const dispatch = useDispatch();
	const notifications = useSelector(notificationsSelector, shallowEqual);

	useEffect(() => {
		notifications.forEach((notification) => {
			if (!notification.isShown) {
				antNotification[notification.type]({
					message: notification.message,
					description: notification.description,
					onClose: () => {
						dispatch(
							notificationSlice.actions.hide(notification.id)
						);
					}
				});
				dispatch(notificationSlice.actions.markShown(notification.id));
			}
		});
	}, [notifications.length]);
	return (
		<div>
			<button
				onClick={() =>
					dispatch(notificationSlice.actions.addError('Hello World'))
				}
			>
				Add Notification
			</button>
		</div>
	);
};
