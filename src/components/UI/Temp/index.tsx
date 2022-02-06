import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { alertSelector } from '../../../store/alert/selectors';
import { match } from 'ts-pattern';
import { useEffect } from 'react';
import { alertSlice } from '../../../store/alert/slice';
import { notification } from 'antd';

// TODO delete this

export const Temp = () => {
	const dispatch = useDispatch();
	const { show, type, message } = useSelector(alertSelector, shallowEqual);
	const topMessage = match(type)
		.with('success', () => 'Success')
		.with('error', () => 'Error')
		.run();

	useEffect(() => {
		if (show) {
			notification[type]({
				message: topMessage,
				description: message,
				onClose: () => {
					dispatch(alertSlice.actions.hide());
				}
			});
		}
	}, [show]);
	return (
		<div>
			<button
				onClick={() =>
					dispatch(alertSlice.actions.showError('Hello World'))
				}
			>
				Show Notification
			</button>
		</div>
	);
};
