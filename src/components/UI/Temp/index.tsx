import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { alertSelector } from '../../../store/alert/selectors';
import { match } from 'ts-pattern';
import { useEffect } from 'react';
import { alertSlice } from '../../../store/alert/slice';
import { notification } from 'antd';
import { notificationSlice } from '../../../store/notification/slice';
import { notificationsSelector } from '../../../store/notification/selectors';

// TODO delete this

export const Temp = () => {
	const dispatch = useDispatch();
	const notifications = useSelector(notificationsSelector, shallowEqual);

	useEffect(() => {

	}, [notifications.length]);


	// useEffect(() => {
	// 	if (show) {
	// 		notification[type]({
	// 			message: topMessage,
	// 			description: message,
	// 			onClose: () => {
	// 				dispatch(notificationSlice.actions.hide());
	// 			}
	// 		});
	// 	}
	// }, [show]);
	return (
		<div>
			<button
				onClick={() =>
					dispatch(notificationSlice.actions.showError('Hello World'))
				}
			>
				Show Notification
			</button>
		</div>
	);
};
