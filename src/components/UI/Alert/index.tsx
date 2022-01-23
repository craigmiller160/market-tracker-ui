import { Alert as AntAlert } from 'antd';
import './Alert.scss';

// TODO need tests for this

export const Alert = () => {
	return (
		<div className="AlertWrapper">
			<AntAlert
				type="success"
				message="Hello Success"
				description="The detailed message"
				showIcon
				closable
			/>
		</div>
	);
};
