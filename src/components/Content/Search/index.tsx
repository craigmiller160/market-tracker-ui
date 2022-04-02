import './Search.scss';
import { Typography } from 'antd';
import { SearchForm } from './SearchForm';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import { Updater, useImmer } from 'use-immer';
import { SearchValues } from './constants';
import { useMemo } from 'react';

interface State {
	readonly info: InvestmentInfo;
}

const createDoSearch = (setState: Updater<State>) => (values: SearchValues) => {
	setState((draft) => {
		draft.info = {
			name: '',
			symbol: values.symbol,
			type: values.searchType
		};
	});
};

export const Search = () => {
	const [state, setState] = useImmer<State>({
		info: {
			type: InvestmentType.STOCK,
			symbol: '',
			name: ''
		}
	});
	const doSearch = useMemo(() => createDoSearch(setState), [setState]);
	return (
		<RefreshProvider>
			<div className="SearchPage">
				<Typography.Title>Search For Investment</Typography.Title>
				<SearchForm doSearch={doSearch} />
				<InvestmentCard info={state.info} />
			</div>
		</RefreshProvider>
	);
};
