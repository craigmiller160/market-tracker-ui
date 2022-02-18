import { Typography } from 'antd';
import './Markets.scss';
import {
	getMarketInvestmentByType,
	InvestmentsByType
} from '../../../data/MarketPageInvestmentParsing';
import { MarketInvestmentType } from '../../../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/es6/function';
import * as Either from 'fp-ts/es6/Either';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { notificationSlice } from '../../../store/notification/slice';

interface InvestmentResult {
	readonly investments: InvestmentsByType;
	readonly error?: Error;
}

const emptyInvestmentsByType: InvestmentsByType = {
	[MarketInvestmentType.USA_ETF]: [],
	[MarketInvestmentType.INTERNATIONAL_ETF]: [],
	[MarketInvestmentType.CRYPTO]: []
};

const getInvestmentResult = (): InvestmentResult =>
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

const useHandleInvestmentError = (error?: Error) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (error) {
			console.error('Error preparing market data', error);
			dispatch(notificationSlice.actions.addError(error.message));
		}
	}, [error, dispatch]);
};

export const Markets = () => {
	const investmentResult = useMemo(getInvestmentResult, []);
	useHandleInvestmentError(investmentResult.error);

	return (
		<div className="GlobalMarkets" data-testid="markets-page">
			<Typography.Title>All Markets</Typography.Title>
			<h3>Market Sections Coming Back Soon</h3>
		</div>
	);
};
