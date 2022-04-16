import { MarketTime } from '../../types/MarketTime';
import { useDispatch } from 'react-redux';
import { Updater, useImmer } from 'use-immer';
import { useContext, useEffect, useMemo } from 'react';
import {
	getInvestmentData,
	InvestmentData
} from '../../services/MarketInvestmentService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { Dispatch } from 'redux';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { notificationSlice } from '../../store/notification/slice';
import { castDraft } from 'immer';
import { RefreshTimerContext } from '../Content/common/refresh/RefreshTimerContext';
import { isNestedAxiosError } from '../../services/AjaxApi';
import { InvestmentInfo } from '../../types/data/InvestmentInfo';
import { match, when } from 'ts-pattern';
import {
	getInvestmentNotFoundMessage,
	isNestedInvestmentNotFoundError
} from '../../error/InvestmentNotFoundError';
import { MarketStatus } from '../../types/MarketStatus';
import { InvestmentType } from '../../types/data/InvestmentType';

export interface ErrorInfo {
	readonly name: string;
	readonly message: string;
	readonly isAxios: boolean;
}

export interface InvestmentDataState {
	readonly loading: boolean;
	readonly timeAtLastLoading?: MarketTime;
	readonly data: InvestmentData;
	readonly error: ErrorInfo | undefined;
	readonly respectMarketStatus: boolean;
}

const createHandleGetDataError =
	(dispatch: Dispatch, setState: Updater<InvestmentDataState>) =>
	(ex: Error): TaskT<void> =>
	async () => {
		const errorInfo = match(ex)
			.with(
				when(isNestedAxiosError),
				(): ErrorInfo => ({
					name: '',
					message: '',
					isAxios: true
				})
			)
			.with(when(isNestedInvestmentNotFoundError), () => {
				console.error('Error getting data', ex.stack);
				return {
					name: 'InvestmentNotFoundError',
					message: getInvestmentNotFoundMessage(ex),
					isAxios: false
				};
			})
			.otherwise((): ErrorInfo => {
				console.error('Error getting data', ex.stack);
				dispatch(
					notificationSlice.actions.addError(
						`Error getting data: ${ex.message}`
					)
				);
				return {
					name: ex.name,
					message: ex.message,
					isAxios: false
				};
			});

		setState((draft) => {
			draft.loading = false;
			draft.error = errorInfo;
			draft.data = {
				startPrice: 0,
				name: '',
				currentPrice: 0,
				history: []
			};
		});
	};

const createHandleGetDataSuccess =
	(setState: Updater<InvestmentDataState>) =>
	(data: InvestmentData): TaskT<void> =>
	async () => {
		setState((draft) => {
			draft.loading = false;
			draft.error = undefined;
			draft.data = castDraft(data);
		});
	};

const shouldRespectMarketStatus = (info: InvestmentInfo) =>
	info.type !== InvestmentType.CRYPTO;

export const useInvestmentData = (
	time: MarketTime,
	info: InvestmentInfo,
	status: MarketStatus
): InvestmentDataState => {
	const { refreshTimestamp } = useContext(RefreshTimerContext);
	const dispatch = useDispatch();
	const respectMarketStatus = shouldRespectMarketStatus(info);
	const [state, setState] = useImmer<InvestmentDataState>({
		loading: false,
		data: {
			startPrice: 0,
			name: '',
			currentPrice: 0,
			history: []
		},
		error: undefined,
		respectMarketStatus
	});

	const handleGetDataError = useMemo(
		() => createHandleGetDataError(dispatch, setState),
		[dispatch, setState]
	);
	const handleGetDataSuccess = useMemo(
		() => createHandleGetDataSuccess(setState),
		[setState]
	);

	// TODO refresh still triggers quotes, need to prevent that somehow. Probably at the refresh provider level

	useEffect(() => {
		setState((draft) => {
			if (draft.timeAtLastLoading !== time) {
				draft.timeAtLastLoading = time;
			} else {
				draft.data = {
					startPrice: 0,
					name: '',
					currentPrice: 0,
					history: []
				};
			}
			draft.loading = true;
			draft.error = undefined;
		});
	}, [setState, time, info.symbol]);

	useEffect(() => {
		if (MarketStatus.UNKNOWN === status) {
			return;
		}
		const shouldLoadHistoryData =
			status === MarketStatus.OPEN ||
			(status === MarketStatus.CLOSED && !respectMarketStatus);
		pipe(
			getInvestmentData(time, info, shouldLoadHistoryData),
			TaskEither.fold(handleGetDataError, handleGetDataSuccess)
		)();
	}, [
		time,
		info,
		handleGetDataError,
		handleGetDataSuccess,
		status,
		refreshTimestamp,
		respectMarketStatus
	]);

	return state;
};
