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
	console.log('Form', form);
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
			<Form.Item
				name="symbol"
				rules={[{ required: true, message: 'Must provide symbol' }]}
			>
				<Input placeholder="Symbol" />
			</Form.Item>
			<Form.Item shouldUpdate>
				{() => (
					<Button
						type="primary"
						htmlType="submit"
						disabled={
							!form.isFieldsTouched(true) ||
							!!form
								.getFieldsError()
								.filter(({ errors }) => errors.length).length
						}
					>
						Search
					</Button>
				)}
			</Form.Item>
		</Form>
	);
};
