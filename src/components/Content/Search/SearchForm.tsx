import { Button, Form, Input, Radio } from 'antd';
import './SearchForm.scss';
import { useMemo } from 'react';

interface SearchValues {
	// TODO search type needs to be constant
	readonly searchType: string;
	readonly symbol: string;
}

type DoSearchFn = (values: SearchValues) => void;

interface Props {
	readonly doSearch: DoSearchFn;
}

const createSearchForSymbol =
	(doSearch: DoSearchFn) => (values: SearchValues) => {
		doSearch(values);
	};

export const SearchForm = (props: Props) => {
	const [form] = Form.useForm();
	const searchForSymbol = useMemo(
		() => createSearchForSymbol(props.doSearch),
		[props.doSearch]
	);
	return (
		<Form
			className="SearchForm"
			form={form}
			onFinish={searchForSymbol}
			initialValues={{
				searchType: 'stock'
			}}
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
