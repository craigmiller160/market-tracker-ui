import { Alert as AntAlert } from 'antd';
import './Alert.scss';
import { shallowEqual, useSelector } from 'react-redux';
import { alertSelector } from '../../../store/alert/selectors';
import { AlertType } from '../../../store/alert/slice';
import { match } from 'ts-pattern';

// TODO need tests for this

const createAlert = (type: AlertType, message: string) => {
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
		/>
	);
};

const useAlert = () => {
	const { show, type, message } = useSelector(alertSelector, shallowEqual);
	return match(show)
		.with(true, () => createAlert(type, message))
		.otherwise(() => <div />);
};

export const Alert = () => {
	const TheAlert = useAlert();
	return <div className="AlertWrapper">{TheAlert}</div>;
};
