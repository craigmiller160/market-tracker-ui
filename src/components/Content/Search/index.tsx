import './Search.scss';
import { Button, Typography } from 'antd';
import { SearchForm } from './SearchForm';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import { Updater, useImmer } from 'use-immer';
import { SearchValues } from './constants';
import { ReactNode, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';
import { AddToWatchlistModal } from '../Watchlists/AddToWatchlistModal';

interface State {
	readonly info: InvestmentInfo;
	readonly showCard: boolean;
	readonly showAddToWatchlistModal: boolean;
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

interface UseCardActionsProps {
	readonly addToWatchlist: () => void;
}

const useCardActions = (props: UseCardActionsProps): ReactNode[] => [
	<Button key="addToWatchlist" onClick={props.addToWatchlist}>
		+ Watchlist
	</Button>
];

export const Search = () => {
	const marketTime = useSelector(timeValueSelector);
	const [state, setState] = useImmer<State>({
		info: {
			type: InvestmentType.STOCK,
			symbol: '',
			name: ''
		},
		showCard: false,
		showAddToWatchlistModal: false
	});
	const doSearch = useMemo(() => createDoSearch(setState), [setState]);

	useEffect(() => {
		if (state.info.symbol.length > 0) {
			setState((draft) => {
				draft.showCard = true;
			});
		}
	}, [marketTime, state.info.symbol, setState]);

	const CardActions = useCardActions({
		addToWatchlist: () =>
			setState((draft) => {
				draft.showAddToWatchlistModal = true;
			})
	});

	const closeAddToWatchlistModal = () =>
		setState((draft) => {
			draft.showAddToWatchlistModal = false;
		});

	return (
		<RefreshProvider>
			<div className="SearchPage">
				<Typography.Title>Search</Typography.Title>
				<SearchForm doSearch={doSearch} />
				{state.showCard && (
					<InvestmentCard info={state.info} actions={CardActions} />
				)}
			</div>
			<AddToWatchlistModal
				show={state.showAddToWatchlistModal}
				onClose={closeAddToWatchlistModal}
			/>
		</RefreshProvider>
	);
};
