import './Search.scss';
import { Button, Typography } from 'antd';
import { SearchForm } from './SearchForm';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { Updater, useImmer } from 'use-immer';
import { SearchValues } from './constants';
import { ReactNode, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';
import { AddToWatchlistModal } from '../Watchlists/AddToWatchlistModal';
import { InvestmentCardDataLoadingContext } from '../common/InvestmentCard/InvestmentCardDataLoadingContext';
import { useGetInvestmentData } from '../../../queries/InvestmentQueries';

interface State {
	readonly info: InvestmentInfo;
	readonly showCard: boolean;
	readonly addToWatchlistModal: {
		readonly show: boolean;
		readonly symbol: string;
	};
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

const createGetActions =
	(addToWatchlist: (symbol: string) => void) =>
	// eslint-disable-next-line react/display-name
	(symbol: string): ReactNode[] =>
		[
			<Button key="addToWatchlist" onClick={() => addToWatchlist(symbol)}>
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
		addToWatchlistModal: {
			show: false,
			symbol: ''
		}
	});
	const doSearch = useMemo(() => createDoSearch(setState), [setState]);

	useEffect(() => {
		if (state.info.symbol.length > 0) {
			setState((draft) => {
				draft.showCard = true;
			});
		}
	}, [marketTime, state.info.symbol, setState]);

	const getActions = createGetActions((symbol: string) =>
		setState((draft) => {
			draft.addToWatchlistModal.show = true;
			draft.addToWatchlistModal.symbol = symbol;
		})
	);

	const closeAddToWatchlistModal = () =>
		setState((draft) => {
			draft.addToWatchlistModal = {
				show: false,
				symbol: ''
			};
		});

	return (
		<>
			<div className="SearchPage" data-testid="search-page">
				<Typography.Title>Search</Typography.Title>
				<SearchForm doSearch={doSearch} />
				<InvestmentCardDataLoadingContext.Provider
					value={useGetInvestmentData}
				>
					{state.showCard && (
						<InvestmentCard
							info={state.info}
							getActions={getActions}
						/>
					)}
				</InvestmentCardDataLoadingContext.Provider>
			</div>
			<AddToWatchlistModal
				symbol={state.addToWatchlistModal.symbol}
				show={state.addToWatchlistModal.show}
				onClose={closeAddToWatchlistModal}
			/>
		</>
	);
};
