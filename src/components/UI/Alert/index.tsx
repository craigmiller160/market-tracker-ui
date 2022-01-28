import { Alert as AntAlert } from 'antd';
import './Alert.scss';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { alertSelector } from '../../../store/alert/selectors';
import { alertSlice, AlertType } from '../../../store/alert/slice';
import { match } from 'ts-pattern';
import { Dispatch } from 'redux';

const createAlert = (type: AlertType, message: string, dispatch: Dispatch) => {
	const topMessage = match(type)
		.with('success', () => 'Success')
		.with('error', () => 'Error')
		.run();

	return (
		<AntAlert
			type={type}
			message={topMessage}
			description={message}
			showIcon
			closable
			afterClose={() => dispatch(alertSlice.actions.hide())}
		/>
	);
};

const useAlert = () => {
	const { show, type, message } = useSelector(alertSelector, shallowEqual);
	const dispatch = useDispatch();
	return match(show)
		.with(true, () => createAlert(type, message, dispatch))
		.otherwise(() => <div />);
};

export const Alert = () => {
	const TheAlert = useAlert();
	return <div className="AlertWrapper">{TheAlert}</div>;
};
