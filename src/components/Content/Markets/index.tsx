import { Typography } from 'antd';
import './Markets.scss';
import {
	InvestmentsByType,
	marketInvestmentsByType
} from '../../../data/MarketPageInvestmentParsing';
import { pipe } from 'fp-ts/es6/function';
import * as Either from 'fp-ts/es6/Either';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { notificationSlice } from '../../../store/notification/slice';
import { MarketInvestmentType } from '../../../types/data/MarketInvestmentType';
import { MarketSection } from './MarketSection';
import { RefreshProvider } from '../common/refresh/RefreshProvider';

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
		marketInvestmentsByType,
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
		<RefreshProvider>
			<div className="GlobalMarkets" data-testid="markets-page">
				<Typography.Title>All Markets</Typography.Title>
				<MarketSection
					marketType={MarketInvestmentType.USA_ETF}
					data={investmentResult.investments}
				/>
				<MarketSection
					marketType={MarketInvestmentType.INTERNATIONAL_ETF}
					data={investmentResult.investments}
				/>
				<MarketSection
					marketType={MarketInvestmentType.CRYPTO}
					data={investmentResult.investments}
				/>
			</div>
		</RefreshProvider>
	);
};
