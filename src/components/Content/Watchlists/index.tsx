import { Updater, useImmer } from 'use-immer';
import { DbWatchlist } from '../../../types/Watchlist';
import { match } from 'ts-pattern';
import './Watchlists.scss';
import { useEffect, useMemo } from 'react';
import { Spinner } from '../../UI/Spinner';
import { Button, Typography } from 'antd';
import { Accordion, AccordionPanelConfig } from '../../UI/Accordion';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import { ConfirmModal, ConfirmModalResult } from '../../UI/ConfirmModal';
import { InputModal } from '../../UI/InputModal';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import {
	createWatchlist,
	getAllWatchlists,
	removeStockFromWatchlist,
	removeWatchlist,
	renameWatchlist
} from '../../../services/WatchlistService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { castDraft } from 'immer';
import { AccordionInvestment } from '../../UI/Accordion/AccordionInvestment';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { WatchlistPanelTitle } from './WatchlistPanelTitle';
import { WatchlistPanelActions } from './WatchlistPanelActions';
import { BreakpointName, useBreakpointName } from '../../utils/Breakpoints';

interface State {
	readonly loading: boolean;
	readonly watchlists: ReadonlyArray<DbWatchlist>;
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

const createGetWatchlists = (setState: Updater<State>): TaskTryT<void> =>
	pipe(
		getAllWatchlists(),
		TaskEither.map((watchlists) =>
			setState((draft) => {
				draft.watchlists = castDraft(watchlists);
				draft.loading = false;
			})
		)
	);

const createHandleAddWatchlistResult =
	(setState: Updater<State>, getWatchlists: TaskTryT<void>) =>
	(value?: string) => {
		setState((draft) => {
			draft.inputModal.show = false;
		});
		if (value) {
			pipe(
				createWatchlist(value),
				TaskEither.chain(() => getWatchlists)
			)();
		}
	};

const getTitleSpace = (breakpointName: BreakpointName): string | JSX.Element =>
	match(breakpointName)
		.with(BreakpointName.XS, () => <br />)
		.otherwise(() => ' ');

const createShowAddWatchlistModal = (setState: Updater<State>) => () =>
	setState((draft) => {
		draft.inputModal.show = true;
	});

const createHandleConfirmModalAction =
	(setState: Updater<State>, getWatchlists: TaskTryT<void>) =>
	(result: ConfirmModalResult, watchlistName: string, symbol?: string) => {
		if (ConfirmModalResult.OK === result) {
			setState((draft) => {
				draft.confirmModal.show = false;
				draft.loading = true;
			});
			const action = symbol
				? removeStockFromWatchlist(watchlistName, symbol)
				: removeWatchlist(watchlistName);
			pipe(
				action,
				TaskEither.chain(() => getWatchlists)
			)();
		} else {
			setState((draft) => {
				draft.confirmModal.show = false;
			});
		}
	};

const createOnRenameWatchlist = (setState: Updater<State>) => (id?: string) =>
	setState((draft) => {
		draft.renameWatchlistId = id;
	});

const createOnSaveRenamedWatchlist =
	(setState: Updater<State>) => (id: string, newName: string) =>
		setState((draft) => {
			const watchlistToChangeIndex = draft.watchlists.findIndex(
				(watchlist) => watchlist._id === id
			);
			const watchlistToChange = draft.watchlists[watchlistToChangeIndex];
			const oldName = watchlistToChange.watchlistName;
			draft.renameWatchlistId = undefined;
			draft.watchlists[watchlistToChangeIndex] = castDraft({
				...watchlistToChange,
				watchlistName: newName
			});
			renameWatchlist(oldName, newName)();
		});

const createShowConfirmRemoveWatchlist =
	(setState: Updater<State>) => (id: string) =>
		setState((draft) => {
			const foundWatchlist = draft.watchlists.find(
				(watchlist) => watchlist._id === id
			);
			if (foundWatchlist) {
				draft.confirmModal = {
					show: true,
					message: `Are you sure you want to remove watchlist "${foundWatchlist.watchlistName}"`,
					watchlistName: foundWatchlist.watchlistName
				};
			}
		});

const createShowConfirmRemoveStock =
	(setState: Updater<State>) => (watchlistId: string, symbol: string) =>
		setState((draft) => {
			const watchlistName = draft.watchlists.find(
				(watchlist) => watchlist._id === watchlistId
			)?.watchlistName;
			if (!watchlistName) {
				return;
			}
			draft.confirmModal = {
				show: true,
				watchlistName,
				symbol,
				message: `Are you sure you want to remove "${symbol}" from watchlist "${watchlistName}"`
			};
		});

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
			actions: (
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
			),
			key: watchlist._id,
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
		loading: true,
		watchlists: [],
		confirmModal: {
			show: false,
			message: '',
			watchlistName: ''
		},
		inputModal: {
			show: false
		}
	});

	const getWatchlists = useMemo(
		() => createGetWatchlists(setState),
		[setState]
	);

	useEffect(() => {
		getWatchlists();
	}, [getWatchlists]);

	const showAddWatchlistModal = useMemo(
		() => createShowAddWatchlistModal(setState),
		[setState]
	);
	const handleConfirmModalAction = useMemo(
		() => createHandleConfirmModalAction(setState, getWatchlists),
		[setState, getWatchlists]
	);
	const handleAddWatchlistResult = useMemo(
		() => createHandleAddWatchlistResult(setState, getWatchlists),
		[setState, getWatchlists]
	);

	const breakpointName = useBreakpointName();
	const titleSpace = getTitleSpace(breakpointName);

	const onRenameWatchlist = useMemo(
		() => createOnRenameWatchlist(setState),
		[setState]
	);
	const onSaveRenamedWatchlist = useMemo(
		() => createOnSaveRenamedWatchlist(setState),
		[setState]
	);
	const showConfirmRemoveWatchlist = useMemo(
		() => createShowConfirmRemoveWatchlist(setState),
		[setState]
	);

	const showConfirmRemoveStock = useMemo(
		() => createShowConfirmRemoveStock(setState),
		[setState]
	);

	const panelConfig: WatchlistPanelConfig = {
		breakpointName,
		renameWatchlistId: state.renameWatchlistId,
		onRenameWatchlist,
		onSaveRenamedWatchlist,
		onRemoveWatchlist: showConfirmRemoveWatchlist,
		onRemoveStock: showConfirmRemoveStock
	};

	const combinedWatchlists = useMemo(() => {
		return [
			...state.watchlists,
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
	}, [state.watchlists]);

	const panels = createPanels(combinedWatchlists, panelConfig);
	const body = match(state)
		.with({ loading: true }, () => <Spinner />)
		.otherwise(() => <Accordion panels={panels} />);

	return (
		<RefreshProvider>
			<div
				className={`WatchlistsPage ${breakpointName}`}
				data-testid="watchlist-page"
			>
				<Typography.Title>
					Investment{titleSpace}Watchlists
				</Typography.Title>
				<div className="RootActions">
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
		</RefreshProvider>
	);
};
