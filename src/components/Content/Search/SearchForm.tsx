import { Form, Input } from 'antd';

const onFinish = (values: any) => {
	console.log('OnFinish', values);
};

const onFinishFailed = (errorInfo: any) => {
	console.log('OnFinishFailed', errorInfo);
};

export const SearchForm = () => {
	return (
		<Form>
			<Form.Item label="Symbol" name="symbol">
				<Input />
			</Form.Item>
		</Form>
	);
};
