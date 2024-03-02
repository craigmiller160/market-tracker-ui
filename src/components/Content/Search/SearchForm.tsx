import { Button, Form, Input, Radio } from 'antd';
import './SearchForm.scss';
import { useMemo } from 'react';
import { type SearchValues } from './constants';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { toNameCase } from '../../../utils/stringUtils';
import { useBreakpointName } from '../../utils/Breakpoints';

type DoSearchFn = (values: SearchValues) => void;

interface Props {
	readonly doSearch: DoSearchFn;
}

const createSearchForSymbol =
	(doSearch: DoSearchFn) => (values: SearchValues) => {
		doSearch(values);
	};

interface SearchTypeRadioProps {
	readonly searchType: InvestmentType;
}
const SearchTypeRadio = ({ searchType }: SearchTypeRadioProps) => (
	<Radio.Button value={searchType}>{toNameCase(searchType)}</Radio.Button>
);

const toUpperCase = (value?: string) => value?.toUpperCase() ?? '';

export const SearchForm = (props: Props) => {
	const [form] = Form.useForm();
	const searchForSymbol = useMemo(
		() => createSearchForSymbol(props.doSearch),
		[props.doSearch]
	);
	const breakpointName = useBreakpointName();
	const rootClassName = `SearchForm ${breakpointName}`;
	return (
		<Form
			className={rootClassName}
			form={form}
			onFinish={searchForSymbol}
			initialValues={{
				searchType: InvestmentType.STOCK
			}}
		>
			<div className="search-type">
				<Form.Item name="searchType">
					<Radio.Group>
						<SearchTypeRadio searchType={InvestmentType.STOCK} />
						{process.env.NODE_ENV !== 'production' && (
							<SearchTypeRadio
								searchType={InvestmentType.CRYPTO}
							/>
						)}
					</Radio.Group>
				</Form.Item>
			</div>
			<div className="search-field-and-button">
				<Form.Item name="symbol" normalize={toUpperCase}>
					<Input placeholder="Symbol" allowClear />
				</Form.Item>
				<Form.Item shouldUpdate>
					{(innerForm) => (
						<Button
							type="primary"
							htmlType="submit"
							disabled={
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								(innerForm.getFieldsValue()?.symbol?.length ??
									0) === 0
							}
						>
							Search
						</Button>
					)}
				</Form.Item>
			</div>
		</Form>
	);
};
