import { Alert as AntAlert } from 'antd';

// TODO need tests for this

export const Alert = () => {
	return (
		<AntAlert
			type="success"
			message="Hello Success"
			description="The detailed message"
			showIcon
			closable
		/>
	);
};
