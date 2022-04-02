import { Button, Form, Input, Radio } from 'antd';
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
		<Form
			className="SearchForm"
			form={form}
			onFinish={onFinish}
			initialValues={{
				searchType: 'stock'
			}}
			onFinishFailed={onFinishFailed}
		>
			<Form.Item name="searchType">
				<Radio.Group>
					<Radio.Button value="stock">Stock</Radio.Button>
					<Radio.Button value="crypto">Crypto</Radio.Button>
				</Radio.Group>
			</Form.Item>
			<Form.Item name="symbol" rules={[
                { required: true, message: 'Must provide symbol' }
            ]}>
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
