import { Button, Form, Input } from 'antd';
import './SearchForm.scss';

const onFinish = (values: any) => {
	console.log('OnFinish', values);
};

const onFinishFailed = (errorInfo: any) => {
	console.log('OnFinishFailed', errorInfo);
};

export const SearchForm = () => {
	const [form] = Form.useForm();
	return (
		<Form className="SearchForm" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
			<Form.Item name="symbol">
				<Input placeholder="Symbol" />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Search
				</Button>
			</Form.Item>
		</Form>
	);
};
