import { Typography } from 'antd';
import './Markets.scss';
import {
	getMarketInvestmentByType,
	InvestmentsByType
} from '../../../data/MarketPageInvestmentParsing';
import { MarketInvestmentType } from '../../../types/data/MarketInvestmentInfo';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/function';
import * as Either from 'fp-ts/es6/Either';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notificationSlice } from '../../../store/notification/slice';

interface State {
	readonly investments: InvestmentsByType;
	readonly error?: Error;
}

const emptyInvestmentsByType: InvestmentsByType = {
	[MarketInvestmentType.USA_ETF]: [],
	[MarketInvestmentType.INTERNATIONAL_ETF]: [],
	[MarketInvestmentType.CRYPTO]: []
};

const createInitialState = (): State =>
	pipe(
		getMarketInvestmentByType(),
		Either.fold(
			(ex) => ({
				investments: emptyInvestmentsByType,
				error: ex
			}),
			(investments) => ({
				investments
			})
		)
	);

export const Markets = () => {
	const dispatch = useDispatch();
	const [state] = useImmer<State>(createInitialState());
	useEffect(() => {
		if (state.error) {
			console.error('Error preparing market data', state.error);
			dispatch(notificationSlice.actions.addError(state.error.message));
		}
	}, [state.error]);
	console.log(state);

	return (
		<div className="GlobalMarkets" data-testid="markets-page">
			<Typography.Title>All Markets</Typography.Title>
			<h3>Market Sections Coming Back Soon</h3>
		</div>
	);
};
