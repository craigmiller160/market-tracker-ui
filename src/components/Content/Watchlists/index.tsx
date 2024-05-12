import { type Updater, useImmer } from 'use-immer';
import { type DbWatchlist } from '../../../types/Watchlist';
import { match } from 'ts-pattern';
import './Watchlists.scss';
import { useMemo } from 'react';
import { Spinner } from '../../UI/Spinner';
import { Button, Typography } from 'antd';
import { Accordion } from '../../UI/Accordion';
import { ConfirmModal, ConfirmModalResult } from '../../UI/ConfirmModal';
import { InputModal } from '../../UI/InputModal';
import { type AccordionInvestment } from '../../UI/Accordion/AccordionInvestment';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { WatchlistPanelTitle } from './WatchlistPanelTitle';
import { WatchlistPanelActions } from './WatchlistPanelActions';
import { BreakpointName, useBreakpointName } from '../../utils/Breakpoints';
import {
	useCreateWatchlist,
	useGetAllWatchlists,
	useRemoveStockFromWatchlist,
	useRemoveWatchlist,
	useRenameWatchlist
} from '../../../queries/WatchlistQueries';
import { useGetInvestmentData } from '../../../queries/InvestmentQueries';
import type { AccordionPanelConfig } from '../../UI/Accordion/AccordionPanelConfig';

interface State {
	readonly renameWatchlistId?: string;
	readonly confirmModal: {
		readonly show: boolean;
		readonly message: string;
		readonly watchlistName: string;
		readonly symbol?: string;
	};
	readonly inputModal: {
		readonly show: boolean;
	};
}

type HandleAddWatchlistResult = (value?: string) => void;
const useHandleAddWatchlistResult = (
	setState: Updater<State>
): HandleAddWatchlistResult => {
	const { mutate: createWatchlist } = useCreateWatchlist();
	return (watchlistName) => {
		setState((draft) => {
			draft.inputModal.show = false;
		});
		if (watchlistName) {
			createWatchlist({ watchlistName });
		}
	};
};

const createShowAddWatchlistModal = (setState: Updater<State>) => () =>
	setState((draft) => {
		draft.inputModal.show = true;
	});

type HandleConfirmModalAction = (
	result: ConfirmModalResult,
	watchlistName: string,
	symbol?: string
) => void;

const useHandleConfirmModalAction = (
	setState: Updater<State>
): HandleConfirmModalAction => {
	const { mutate: removeStockFromWatchlist } = useRemoveStockFromWatchlist();
	const { mutate: removeWatchlist } = useRemoveWatchlist();

	return (result, watchlistName, stockSymbol) => {
		setState((draft) => {
			draft.confirmModal.show = false;
		});

		if (ConfirmModalResult.CANCEL === result) {
			return;
		}

		if (stockSymbol) {
			removeStockFromWatchlist({ watchlistName, stockSymbol });
		} else {
			removeWatchlist({ watchlistName });
		}
	};
};

const createOnRenameWatchlist = (setState: Updater<State>) => (id?: string) =>
	setState((draft) => {
		draft.renameWatchlistId = id;
	});

type OnSaveRenamedWatchlist = (id: string, newName: string) => void;
const useOnSaveRenamedWatchlist = (
	setState: Updater<State>
): OnSaveRenamedWatchlist => {
	const { mutate: renameWatchlist } = useRenameWatchlist();
	const { data } = useGetAllWatchlists();
	return (id, newName) => {
		if (!data) {
			return;
		}

		const watchlistToChangeIndex = data.findIndex(
			(watchlist) => watchlist._id === id
		);
		const oldName = data[watchlistToChangeIndex].watchlistName;

		setState((draft) => {
			draft.renameWatchlistId = undefined;
		});

		renameWatchlist({ oldName, newName });
	};
};

type ShowConfirmRemoveWatchlist = (id: string) => void;
const useShowConfirmRemoveWatchlist = (
	setState: Updater<State>
): ShowConfirmRemoveWatchlist => {
	const { data } = useGetAllWatchlists();
	return (id) => {
		if (!data) {
			return;
		}

		const foundWatchlist = data.find((watchlist) => watchlist._id === id);
		if (foundWatchlist) {
			setState((draft) => {
				draft.confirmModal = {
					show: true,
					message: `Are you sure you want to remove watchlist "${foundWatchlist.watchlistName}"`,
					watchlistName: foundWatchlist.watchlistName
				};
			});
		}
	};
};

type ShowConfirmRemoveStock = (watchlistId: string, symbol: string) => void;
const useShowConfirmRemoveStock = (
	setState: Updater<State>
): ShowConfirmRemoveStock => {
	const { data } = useGetAllWatchlists();
	return (watchlistId, symbol) => {
		if (!data) {
			return;
		}

		const watchlistName = data.find(
			(watchlist) => watchlist._id === watchlistId
		)?.watchlistName;

		if (!watchlistName) {
			return;
		}

		setState((draft) => {
			draft.confirmModal = {
				show: true,
				watchlistName,
				symbol,
				message: `Are you sure you want to remove "${symbol}" from watchlist "${watchlistName}"`
			};
		});
	};
};

interface WatchlistPanelConfig {
	readonly breakpointName: BreakpointName;
	readonly renameWatchlistId?: string;
	readonly onRenameWatchlist: (id?: string) => void;
	readonly onRemoveWatchlist: (id: string) => void;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
	readonly onRemoveStock: (id: string, symbol: string) => void;
}

const createPanels = (
	watchlists: ReadonlyArray<DbWatchlist>,
	config: WatchlistPanelConfig
): ReadonlyArray<AccordionPanelConfig> =>
	watchlists.map(
		(watchlist): AccordionPanelConfig => ({
			title: (
				<WatchlistPanelTitle
					watchlist={watchlist}
					renameWatchlistId={config.renameWatchlistId}
					onSaveRenamedWatchlist={config.onSaveRenamedWatchlist}
					onClearRenamedWatchlistId={() =>
						config.onRenameWatchlist(undefined)
					}
				/>
			),
			actions:
				watchlist.cryptos.length === 0 ? (
					<WatchlistPanelActions
						breakpointName={config.breakpointName}
						onRenameWatchlist={() =>
							config.onRenameWatchlist(watchlist._id)
						}
						onRemoveWatchlist={() =>
							config.onRemoveWatchlist(watchlist._id)
						}
						renameWatchlistId={config.renameWatchlistId}
					/>
				) : undefined,
			key: watchlist._id,
			useLoadInvestmentData: useGetInvestmentData,
			investments: [
				...watchlist.stocks.map(
					(stock): AccordionInvestment => ({
						symbol: stock.symbol,
						type: InvestmentType.STOCK,
						name: '',
						getActions: (symbol: string) => [
							<Button
								key="remove"
								onClick={() =>
									config.onRemoveStock(watchlist._id, symbol)
								}
							>
								Remove
							</Button>
						]
					})
				),
				...watchlist.cryptos.map(
					(crypto): AccordionInvestment => ({
						symbol: crypto.symbol,
						type: InvestmentType.CRYPTO,
						name: ''
					})
				)
			]
		})
	);

export const Watchlists = () => {
	const [state, setState] = useImmer<State>({
		confirmModal: {
			show: false,
			message: '',
			watchlistName: ''
		},
		inputModal: {
			show: false
		}
	});

	const { data: watchlists, isFetching: getAllWatchlistsLoading } =
		useGetAllWatchlists();
	const { isLoading: removeStockFromWatchlistLoading } =
		useRemoveStockFromWatchlist();
	const { isLoading: createWatchlistLoading } = useCreateWatchlist();
	const { isLoading: renameWatchlistLoading } = useRenameWatchlist();

	const loading =
		getAllWatchlistsLoading ||
		removeStockFromWatchlistLoading ||
		createWatchlistLoading ||
		renameWatchlistLoading;

	const showAddWatchlistModal = useMemo(
		() => createShowAddWatchlistModal(setState),
		[setState]
	);
	const handleConfirmModalAction = useHandleConfirmModalAction(setState);
	const handleAddWatchlistResult = useHandleAddWatchlistResult(setState);

	const breakpointName = useBreakpointName();

	const onRenameWatchlist = useMemo(
		() => createOnRenameWatchlist(setState),
		[setState]
	);
	const onSaveRenamedWatchlist = useOnSaveRenamedWatchlist(setState);
	const showConfirmRemoveWatchlist = useShowConfirmRemoveWatchlist(setState);

	const showConfirmRemoveStock = useShowConfirmRemoveStock(setState);

	const panelConfig: WatchlistPanelConfig = {
		breakpointName,
		renameWatchlistId: state.renameWatchlistId,
		onRenameWatchlist,
		onSaveRenamedWatchlist,
		onRemoveWatchlist: showConfirmRemoveWatchlist,
		onRemoveStock: showConfirmRemoveStock
	};

	const combinedWatchlists = useMemo(() => {
		if (watchlists) {
			return [
				...watchlists,
				{
					_id: '',
					userId: '',
					watchlistName: 'Cryptocurrency',
					stocks: [],
					cryptos: [
						{
							symbol: 'BTC'
						},
						{
							symbol: 'ETH'
						}
					]
				}
			].sort((a, b) => a.watchlistName.localeCompare(b.watchlistName));
		}
		return [];
	}, [watchlists]);

	const panels = createPanels(combinedWatchlists, panelConfig);
	const body = match(loading)
		.with(true, () => <Spinner />)
		.otherwise(() => <Accordion panels={panels} />);

	return (
		<>
			<div
				className={`watchlists-page ${breakpointName}`}
				data-testid="watchlist-page"
			>
				<Typography.Title level={2}>Watchlists</Typography.Title>
				<div className="root-actions">
					<Button onClick={showAddWatchlistModal}>Add</Button>
				</div>
				{body}
			</div>
			<ConfirmModal
				title="Remove"
				show={state.confirmModal.show}
				message={state.confirmModal.message}
				onClose={(result) =>
					handleConfirmModalAction(
						result,
						state.confirmModal.watchlistName,
						state.confirmModal.symbol
					)
				}
			/>
			<InputModal
				title="Add Watchlist"
				show={state.inputModal.show}
				label="Name"
				onClose={handleAddWatchlistResult}
			/>
		</>
	);
};
