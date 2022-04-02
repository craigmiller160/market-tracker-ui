import { Button, Form, Input, Radio } from 'antd';
import './SearchForm.scss';
import { useMemo } from 'react';
import {
	SEARCH_TYPE,
	SEARCH_TYPE_CRYPTO,
	SEARCH_TYPE_STOCK,
	SearchValues
} from './constants';

type DoSearchFn = (values: SearchValues) => void;

interface Props {
	readonly doSearch: DoSearchFn;
}

const createSearchForSymbol =
	(doSearch: DoSearchFn) => (values: SearchValues) => {
		doSearch(values);
	};

interface SearchTypeRadioProps {
	readonly searchType: SEARCH_TYPE;
}
const SearchTypeRadio = ({ searchType }: SearchTypeRadioProps) => (
	<Radio.Button value={searchType}>{searchType}</Radio.Button>
);

const toUpperCase = (value?: string) => value?.toUpperCase() ?? '';

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
				searchType: SEARCH_TYPE_STOCK
			}}
		>
			<Form.Item name="searchType">
				<Radio.Group>
					<SearchTypeRadio searchType={SEARCH_TYPE_STOCK} />
					{process.env.NODE_ENV !== 'production' && (
						<SearchTypeRadio searchType={SEARCH_TYPE_CRYPTO} />
					)}
				</Radio.Group>
			</Form.Item>
			<Form.Item
				name="symbol"
				normalize={toUpperCase}
				rules={[{ required: true, message: 'Must provide symbol' }]}
			>
				<Input placeholder="Symbol" />
			</Form.Item>
			<Form.Item shouldUpdate>
				{(innerForm) => (
					<Button
						type="primary"
						htmlType="submit"
						disabled={
							!innerForm.isFieldsTouched() ||
							!!innerForm
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
