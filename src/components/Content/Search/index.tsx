// TODO delete this eslint disable in the future
/* eslint-disable @typescript-eslint/no-empty-function */
import './Search.scss';
import { Typography } from 'antd';
import { SearchForm } from './SearchForm';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { RefreshProvider } from '../common/refresh/RefreshProvider';

export const Search = () => {
	const info: InvestmentInfo = {
		type: InvestmentType.STOCK,
		symbol: '',
		name: ''
	};
	return (
		<RefreshProvider>
			<div className="SearchPage">
				<Typography.Title>Search For Investment</Typography.Title>
				<SearchForm doSearch={() => {}} />
				<InvestmentCard info={info} />
			</div>
		</RefreshProvider>
	);
};
